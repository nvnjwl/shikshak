export function SubjectCardSkeleton() {
    return (
        <div className="h-64 bg-white rounded-3xl border-2 border-gray-100 p-6 animate-pulse">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="space-y-3 mt-auto">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 ml-auto"></div>
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
            {/* AI Companion Skeleton */}
            <div className="mb-12 bg-white rounded-3xl p-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            {/* Subject Grid Skeleton */}
            <div className="mb-6 flex items-center justify-between">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <SubjectCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export function LoadingSkeleton({ type = 'dashboard' }) {
    if (type === 'dashboard') {
        return <DashboardSkeleton />;
    }

    if (type === 'card') {
        return <SubjectCardSkeleton />;
    }

    // Default skeleton
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    );
}
