"use client";

import { useSidebar } from "@/store/use-sidebar";

import { UserItem, UserItemSkeleton } from "./user-item";

interface CustomUser {
    id: string,
    username: string,
    imageUrl: string,
}

interface FollowingProps {
    data: ({id: string} & { 
        following: CustomUser & {
            stream: { isLive: boolean } | null;
        },
    })[];
}

export const Following = ({ data }: FollowingProps) => {
    const { collapsed } = useSidebar((state) => state);

    const showLabel = !collapsed && data.length > 0;

    if (!data.length) {
        return null;
    }

    return (
        <div>
            {showLabel && (
                <div className="pl-6 mb-4">
                    <p className="text-sm text-muted-foreground">
                        Following
                    </p>
                </div>
            )}
            
            <ul className="space-y-2 px-2">
                {data.map((follow) => (
                    <UserItem
                        key={follow.following.id}
                        username={follow.following.username}
                        imageUrl={follow.following.imageUrl}
                        isLive={follow.following.stream?.isLive}
                    />
                ))}
            </ul>
        </div>
    );
};

export const FollowingSkeleton = () => {
    return (
        <ul className="px-2 pt-2 lg:pt-0">
            {[...Array(3)].map((_, i) => (
                <UserItemSkeleton key={i} />
            ))}
        </ul>
    );
};
