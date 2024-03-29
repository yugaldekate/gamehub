"use client";

import { toast } from "sonner";
import { Heart } from "lucide-react";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { onFollow, onUnfollow } from "@/actions/follow";

interface ActionsProps {
    hostIdentity: string;
    isFollowing: boolean;
    isHost: boolean;
    isLoggedIn: boolean;
};

export const Actions = ({ hostIdentity, isFollowing, isHost, isLoggedIn }: ActionsProps) => {
    const router = useRouter();
    
    const [isPending, startTransition] = useTransition();
    
    const handleFollow = () => {
        startTransition(() => {
            onFollow(hostIdentity)
                .then((data) => toast.success(`You are now following ${data.success}`))
                .catch(() => toast.error("Something went wrong"))
            });
    }

    const handleUnfollow = () => {
        startTransition(() => {
            onUnfollow(hostIdentity)
                .then((data) => toast.success(`You have unfollowed ${data.success}`))
                .catch(() => toast.error("Something went wrong"))
            });
    }

    const toggleFollow = () => {
        if (!isLoggedIn) {
            return router.push("/sign-in");
        }

        if (isHost) return;

        if (isFollowing) {
            handleUnfollow();
        } else {
            handleFollow();
        }
    }

    return (
        <Button
            disabled={isPending || isHost}
            onClick={toggleFollow}
            variant="primary"
            size="sm"
            className="w-full lg:w-auto"
        >
            <Heart className={cn("h-4 w-4 mr-2", isFollowing ? "fill-white" : "fill-none")} />
                {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    )
};

export const ActionsSkeleton = () => {
    return (
        <Skeleton className="h-10 w-full lg:w-24" />
    );
};
