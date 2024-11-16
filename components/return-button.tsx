"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ReturnButton() {
  const router = useRouter();

  return (
    <Button variant="secondary" size="icon" onClick={() => router.back()}>
      <ArrowLeft className="size-5" />
    </Button>
  );
}
