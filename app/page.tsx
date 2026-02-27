"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";

export default function RootPage() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [currentUser, router]);

  return null;
}
