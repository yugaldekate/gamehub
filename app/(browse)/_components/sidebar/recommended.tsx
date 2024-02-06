"use client"

import { useSidebar } from "@/store/use-sidebar";

import { UserItem, UserItemSkeleton } from "./user-item";

interface CustomUser {
    id: string,
    username: string,
    imageUrl: string,
}


interface RecommendedProps {
    data: (CustomUser & {
        stream: { isLive: boolean } | null;
    })[];
};

export const Recommended = ({data} : RecommendedProps) => {

    const {collapsed} = useSidebar((state) => state);

    const showLabel = !collapsed && data.length > 0;

    return (
        <div>
            {showLabel && (
                <div className="pl-6 mb-4">
                    <p className="text-sm text-muted-foreground">
                        Recommended
                    </p>
                </div>
            )}
            
            <ul className="space-y-2 px-2">
                {data.map((user) => (
                    <UserItem
                        key={user.id}
                        username={user.username}
                        imageUrl={user.imageUrl}
                        isLive={user.stream?.isLive}
                    />
                ))}
            </ul>
        </div>
    );
}

export const RecommendedSkeleton = () => {
    return (
        <ul className="px-2">
            {[...Array(5)].map((_, i) => (
                <UserItemSkeleton key={i} />
            ))}
        </ul>
    );
};