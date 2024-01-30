"use client"

import { cn } from "@/lib/utils";
import { useViewerToken } from "@/hooks/use-viewer-token";

import { LiveKitRoom } from "@livekit/components-react";

import { Video } from "./video";

type CustomStream = {
    id: string;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
    isLive: boolean;
    thumbnailUrl: string | null;
    name: string;
};
  
type CustomUser = {
    id: string;
    username: string;
    bio: string | null;
    stream: CustomStream | null;
    imageUrl: string;
};

interface StreamPlayerProps {
    user: CustomUser;
    stream: CustomStream;
    isFollowing: boolean;
}

const StreamPlayer = ({ user, stream } : StreamPlayerProps) => {

    const { token, name, identity } = useViewerToken(user.id);   
    
    if (!token || !name || !identity) {
        return <div>Cannot watch the stream</div>
    }
    
    return ( 
        <>
            <LiveKitRoom
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
                className={cn("h-full grid grid-cols-1 lg:grid-cols-3 lg:gap-y-0 xl:grid-cols-3 2xl:grid-cols-6")}
            >
                <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10" >
                    <Video
                        hostName={user.username}
                        hostIdentity={user.id}
                    />
                </div>
            </LiveKitRoom>
        </>
    );
}
 
export default StreamPlayer;