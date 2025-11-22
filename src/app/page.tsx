"use client";

import React, { useEffect, useState } from "react";

import type { Venue } from "@/types/venue";

import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainContent from "@/components/layout/MainContent";

export default function HomePage() {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load venue data
    fetch("/venue.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load venue data");
        }
        return res.json();
      })
      .then((data: Venue) => {
        setVenue(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !venue) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header venueName={venue.name} />
      <MainContent venue={venue} />
      <Footer />
    </div>
  );
}
