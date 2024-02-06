import { currentUser } from "@clerk/nextjs";

import { notFound } from "next/navigation";

import { getUserByUsername } from "@/lib/user-service";
import { isFollowingUser } from "@/lib/follow-service";
import { isBlockedByUser } from "@/lib/block-service";

import StreamPlayer from "@/components/stream-player";

interface UserPageProps {
    params: {
        username: string;
    };
};

const UserPage = async ({ params }: UserPageProps) => {

    const externalUser = await currentUser();
    const user = await getUserByUsername(params.username);

    if (!user || !user.stream) {
        notFound();
    }

    const isBlocked = await isBlockedByUser(user.id);

    if (isBlocked) {
        notFound();
    }

    const isFollowing = await isFollowingUser(user.id);

    const isLoggedIn = externalUser?.id ? true : false;   

    return (
        <StreamPlayer
            user={user}
            stream={user.stream}
            isFollowing={isFollowing}
            isLoggedIn={isLoggedIn}
        />
    )
}

export default UserPage