
import React from 'react';

interface SkeletalLoaderProps {
    className?: string;
}

const SkeletalLoader: React.FC<SkeletalLoaderProps> = ({ className }) => {
    return (
        <div className={`animate-pulse bg-gray-700 rounded-lg ${className}`}></div>
    );
};

export const GallerySkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <SkeletalLoader className="aspect-square w-full" />
                    <SkeletalLoader className="h-4 w-3/4" />
                </div>
            ))}
        </div>
    );
};

export default SkeletalLoader;
