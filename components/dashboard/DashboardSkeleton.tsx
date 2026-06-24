import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5 sm:gap-6 md:gap-8 animate-pulse">
      {/* 4 Stats Cards — matches DashboardGrid breakpoints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-neutral-900/30 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-3 w-20 bg-neutral-800" />
              <Skeleton className="h-4 w-4 rounded-full bg-neutral-800" />
            </CardHeader>
            <CardContent className="pb-4 sm:pb-5">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-28 bg-neutral-800" />
                <Skeleton className="h-3 w-24 bg-neutral-800" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* EC2 Card Skeleton */}
      <Card className="bg-neutral-900/20 border-neutral-800">
        <CardHeader className="pb-3">
          <Skeleton className="h-3 w-36 bg-neutral-800" />
          <Skeleton className="h-6 w-48 bg-neutral-800 mt-1" />
          <Skeleton className="h-3 w-64 bg-neutral-800 mt-1" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-5 sm:pb-6">
          <Skeleton className="h-20 sm:h-16 w-full rounded-xl bg-neutral-800" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Skeleton className="h-2.5 w-16 bg-neutral-800" />
                <Skeleton className="h-5 w-20 bg-neutral-800" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operations Panel Skeleton */}
      <Card className="bg-neutral-900/20 border-neutral-800">
        <CardHeader className="flex flex-col gap-1.5 pb-4">
          <Skeleton className="h-3 w-20 bg-neutral-800" />
          <Skeleton className="h-6 w-40 bg-neutral-800" />
          <Skeleton className="h-3 w-60 bg-neutral-800" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-5">
          <Skeleton className="h-16 w-full rounded-xl bg-neutral-800" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Skeleton className="h-12 w-full rounded-lg bg-neutral-800" />
            <Skeleton className="h-12 w-full rounded-lg bg-neutral-800" />
            <Skeleton className="h-12 w-full rounded-lg bg-neutral-800" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
