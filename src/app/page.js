"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import Loader from "@/components/Loader";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    router.replace(session ? "/dashboard" : "/login");
  }, [router]);

  return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader label="Loading AI Employee Support..." />
    </div>
  );
}
