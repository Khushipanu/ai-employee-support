"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import Loader from "@/components/Loader";

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const [user, setUser] = useState(undefined); // undefined = checking

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(session.role)) {
      router.replace("/dashboard");
      return;
    }
    setUser(session);
  }, [router, allowedRoles]);

  if (user === undefined) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return children(user);
}
