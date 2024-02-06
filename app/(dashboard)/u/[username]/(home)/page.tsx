import { currentUser } from "@clerk/nextjs";

import { getUserByUsername } from "@/lib/user-service";
import { isFollowingUser } from "@/lib/follow-service";

import StreamPlayer from "@/components/stream-player";
import { notFound } from "next/navigation";

interface CreatorPageProps {
    params: {
        username: string;
    };
};

const CreatorPage = async ({params} : CreatorPageProps) => {

    const externalUser = await currentUser();
    const user = await getUserByUsername(params.username);

    if (!user || !user.stream) {
        notFound();
    }
    const isFollowing = await isFollowingUser(user.id);

    if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
        throw new Error("Unauthorized");
    }

    const isLoggedIn = externalUser.id ? true : false;    

    return ( 
        <div>
            <StreamPlayer 
                user={user} 
                stream={user.stream} 
                isFollowing={isFollowing}
                isLoggedIn={isLoggedIn}
            />
        </div>
    );
}
 
export default CreatorPage;