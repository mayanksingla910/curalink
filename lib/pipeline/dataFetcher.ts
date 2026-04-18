
export async function fetchAllSources({ pubmedQuery, openAlexQuery, trialsQuery }:{pubmedQuery: string, openAlexQuery: string, trialsQuery: { cond: string; term: string }}) {
  const [publications, trials] = await Promise.all([
    fetchPublications(pubmedQuery, openAlexQuery),
    fetchTrials(trialsQuery),
  ]);
  return { publications, trials };
}

async function fetchPublications(pubmedQuery: string, openAlexQuery: string) {
  const [pubmed, openalex] = await Promise.all([
    fetchPubMed(pubmedQuery),
    fetchOpenAlex(openAlexQuery),
  ]);
  return [...pubmed, ...openalex];
}

function parseXML(xml: string) {
  const articles: any[] = []
  const articleMatches = xml.matchAll(/<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g)

  for (const match of articleMatches) {
    const block = match[1]

    const title = block
      .match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim() ?? ""

    // Handle both single and multi-section abstracts
    const abstractMatches = [...block.matchAll(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)]
    const abstract = abstractMatches
      .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
      .filter(Boolean)
      .join(" ")

    const pmid = block.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1] ?? ""
    const year = block.match(/<Year>(\d{4})<\/Year>/)?.[1] ?? "0"

    const authorMatches = [...block.matchAll(/<Author[^>]*>([\s\S]*?)<\/Author>/g)]
    const authors = authorMatches.slice(0, 3).map((a) => {
      const last = a[1].match(/<LastName>(.*?)<\/LastName>/)?.[1] ?? ""
      const fore = a[1].match(/<ForeName>(.*?)<\/ForeName>/)?.[1] ?? ""
      return `${last} ${fore}`.trim()
    }).filter(Boolean)

    if (title && abstract) {
      articles.push({ title, abstract, pmid, year: parseInt(year), authors })
    }
  }
  return articles
}

async function fetchPubMed(query: string) {
  try {
    console.log("PubMed query:", query)
    const searchRes = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=50&sort=pub+date&retmode=json`
    )
    console.log("PubMed search status:", searchRes.status)
    const searchData = await searchRes.json()
    console.log("PubMed IDs found:", searchData.esearchresult?.idlist?.length ?? 0)
    const ids: string[] = searchData.esearchresult?.idlist ?? []
    if (!ids.length) return []

    const fetchRes = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(",")}&retmode=xml`
    )
    console.log("PubMed fetch status:", fetchRes.status)
    const xml = await fetchRes.text()
    console.log("PubMed XML length:", xml.length)

    const articles = parseXML(xml)  // ← regex parser, no xml2js
    console.log("PubMed articles parsed:", articles.length)

    return articles.map((a) => ({
      source: "pubmed" as const,
      title: a.title,
      abstract: a.abstract,  // always a clean string now
      authors: a.authors,
      year: a.year,
      url: `https://pubmed.ncbi.nlm.nih.gov/${a.pmid}/`,
      citations: 0,
    }))
  } catch (e) {
    console.error("PubMed error:", e)
    return []
  }
}

async function fetchOpenAlex(query: string) {
  try {
    console.log("OpenAlex query:", query);
    const res = await fetch(
      `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=50&sort=relevance_score:desc&filter=from_publication_date:2018-01-01`
    );
    console.log("OpenAlex status:", res.status);
    const data = await res.json();
    console.log("OpenAlex results:", data.results?.length ?? 0, "error:", data.error);

    return (data.results ?? []).map((w: any) => ({
      source: "openalex",
      title: w.title ?? "",
      abstract: w.abstract_inverted_index
        ? reconstructAbstract(w.abstract_inverted_index)
        : "",
      authors: (w.authorships ?? [])
        .slice(0, 3)
        .map((a: any) => a.author?.display_name ?? ""),
      year: w.publication_year ?? 0,
      url: w.doi ? `https://doi.org/${w.doi.replace("https://doi.org/", "")}` : w.id,
      citations: w.cited_by_count ?? 0,
    })).filter((p: any) => p.title && p.abstract);
  } catch (e) { console.error("OpenAlex error:", e); return []; }
}

// OpenAlex stores abstracts as inverted index — reconstruct it
function reconstructAbstract(invertedIndex: Record<string, number[]>): string {
  const words: string[] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    positions.forEach((pos) => { words[pos] = word; });
  }
  return words.join(" ");
}

async function fetchTrials({ cond, term }: { cond: string; term: string }) {
  try {
    console.log("Trials query:", { cond, term });
    const res = await fetch(
      `https://clinicaltrials.gov/api/v2/studies?query.cond=${encodeURIComponent(cond)}&query.term=${encodeURIComponent(term)}&pageSize=20&format=json`
    );
    console.log("Trials status:", res.status);
    const data = await res.json();
    console.log("Trials found:", data.studies?.length ?? 0);
    return (data.studies ?? []).map((s: any) => {
      const proto = s.protocolSection;
      return {
        title: proto?.identificationModule?.briefTitle ?? "",
        status: proto?.statusModule?.overallStatus ?? "",
        eligibility: proto?.eligibilityModule?.eligibilityCriteria ?? "",
        locations: (proto?.contactsLocationsModule?.locations ?? [])
          .slice(0, 2)
          .map((l: any) => `${l.city ?? ""}, ${l.country ?? ""}`),
        contact: proto?.contactsLocationsModule?.centralContacts?.[0]?.name ?? "",
        nctId: proto?.identificationModule?.nctId ?? "",
        url: `https://clinicaltrials.gov/study/${proto?.identificationModule?.nctId}`,
      };
    }).filter((t: any) => t.title);
  } catch (e) {
    console.error("Trials error:", e);
    return [];
  }
}