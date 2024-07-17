"use client";

import { ScanFace } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <Button className="h-12 text-lg" onClick={() => signIn("discord")}>
      <ScanFace className="size-5" /> Log in
    </Button>
  );
}
