import { Card, CardContent } from "@/components/ui/card";

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={`bg-zinc-200 animate-pulse rounded-md ${className}`} />
  );
}

export function DebitosWidgetSkeleton() {
  return (
    <Card className="border border-zinc-200 shadow-sm">
      <CardContent className="p-6 space-y-5">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
          <SkeletonBox className="w-8 h-8 rounded-full" />
          <div className="space-y-1.5">
            <SkeletonBox className="w-40 h-4" />
            <SkeletonBox className="w-56 h-3" />
          </div>
        </div>

        {/* Licenciamento skeleton */}
        <div className="space-y-2">
          <SkeletonBox className="w-32 h-5" />
          <div className="grid grid-cols-2 gap-3">
            <SkeletonBox className="h-20 rounded-lg" />
            <SkeletonBox className="h-20 rounded-lg" />
          </div>
        </div>

        {/* IPVA skeleton */}
        <div className="space-y-2">
          <SkeletonBox className="w-20 h-5" />
          <div className="grid grid-cols-2 gap-3">
            <SkeletonBox className="h-20 rounded-lg" />
            <SkeletonBox className="h-20 rounded-lg" />
          </div>
        </div>

        <div className="border-t border-zinc-200" />

        {/* Totalizador skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <SkeletonBox className="w-40 h-4" />
            <SkeletonBox className="w-20 h-4" />
          </div>
          <div className="flex justify-between">
            <SkeletonBox className="w-48 h-4" />
            <SkeletonBox className="w-20 h-4" />
          </div>
          <div className="flex justify-between pt-1">
            <SkeletonBox className="w-12 h-6" />
            <SkeletonBox className="w-28 h-6" />
          </div>
        </div>

        {/* Button skeleton */}
        <div className="flex justify-end">
          <SkeletonBox className="w-44 h-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

export function VeiculoResumoWidgetSkeleton() {
  return (
    <Card className="border border-zinc-200 shadow-sm">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
          <SkeletonBox className="w-5 h-5 rounded" />
          <SkeletonBox className="w-28 h-4" />
        </div>

        {/* Vehicle block */}
        <SkeletonBox className="h-24 rounded-lg" />

        {/* Status badge */}
        <SkeletonBox className="w-full h-11 rounded-lg" />

        {/* Meta info */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <SkeletonBox className="w-32 h-3" />
            <SkeletonBox className="w-28 h-3" />
          </div>
          <div className="flex justify-between">
            <SkeletonBox className="w-28 h-3" />
            <SkeletonBox className="w-10 h-3" />
          </div>
          <div className="flex justify-between">
            <SkeletonBox className="w-20 h-3" />
            <SkeletonBox className="w-16 h-3" />
          </div>
        </div>

        {/* Quick links */}
        <div className="border-t border-zinc-100 pt-3 space-y-2">
          <div className="flex justify-between">
            <SkeletonBox className="w-24 h-4" />
            <SkeletonBox className="w-14 h-4" />
          </div>
          <div className="flex justify-between">
            <SkeletonBox className="w-28 h-4" />
            <SkeletonBox className="w-14 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
