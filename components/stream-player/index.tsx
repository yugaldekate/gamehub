"use client"

import { cn } from "@/lib/utils";
import { useViewerToken } from "@/hooks/use-viewer-token";

import { useChatSidebar } from "@/store/use-chat-sidebar";

import { LiveKitRoom } from "@livekit/components-react";

import { Video, VideoSkeleton } from "./video";
import { Chat, ChatSkeleton } from "./chat";
import { ChatHeaderSkeleton } from "./chat-header";
import { ChatToggle } from "./chat-toggle";

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

const StreamPlayer = ({ user, stream, isFollowing } : StreamPlayerProps) => {

    const { token, name, identity } = useViewerToken(user.id);   

    const { collapsed } = useChatSidebar((state) => state);
    
    if (!token || !name || !identity) {
        return <StreamPlayerSkeleton/>
    }
    
    return ( 
        <>
            {collapsed && (
                <div className="hidden lg:block fixed top-[100px] right-2 z-50">
                    <ChatToggle />
                </div>
            )}
            <LiveKitRoom
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
                className={cn("h-full grid grid-cols-1 lg:grid-cols-3 lg:gap-y-0 xl:grid-cols-3 2xl:grid-cols-6", collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2")}
            >
                <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10" >
                    <Video
                        hostName={user.username}
                        hostIdentity={user.id}
                    />
                </div>

                <div className={cn("col-span-1",collapsed && "hidden")}>
                    <Chat
                        viewerName={name}
                        hostName={user.username}
                        hostIdentity={user.id}
                        isFollowing={isFollowing}
                        isChatEnabled={stream.isChatEnabled}
                        isChatDelayed={stream.isChatDelayed}
                        isChatFollowersOnly={stream.isChatFollowersOnly}
                    />
                </div>  
            </LiveKitRoom>
        </>
    );
}
 
export default StreamPlayer;


export const StreamPlayerSkeleton = () => {
    return (
        <div className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full">
            <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
                <VideoSkeleton />
                <ChatHeaderSkeleton />
            </div>
            <div className="col-span-1 bg-background">
                <ChatSkeleton />
            </div>
        </div>
    )
}