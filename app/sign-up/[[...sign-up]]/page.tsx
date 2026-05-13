import { SignUp } from "@clerk/nextjs";
import { Scale } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-6">
      <SignUp />
    </div>
  );
}