"use client"
import { useRouter } from "next/navigation";
import { ShimmerButton } from "./ui/shimmer-button";

function LoginRedirectButton() {
  const router = useRouter();
  return (
    <ShimmerButton
      onClick={() => router.push("/login")}
    >
      Login
    </ShimmerButton>
  );
}

export default LoginRedirectButton;
