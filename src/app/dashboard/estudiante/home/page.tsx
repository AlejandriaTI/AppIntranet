"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/estudiantes/header";
import { RecentNews } from "@/components/estudiantes/recent-news";
import { Meetings } from "@/components/estudiantes/meetings";
import { AdvisorSubmissions } from "@/components/estudiantes/advisor-submissions";

export default function HomeEstudiante() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-dvh bg-background">
      <Header isLoading={isLoading} />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <RecentNews isLoading={isLoading} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Meetings isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            <AdvisorSubmissions isLoading={isLoading} />
          </div>
        </div>
      </div>
    </section>
  );
}
