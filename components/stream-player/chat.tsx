"use client"

import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import { ConnectionState } from "livekit-client";
import { useChat, useConnectionState, useRemoteParticipant } from "@livekit/components-react";

import { ChatVariant , useChatSidebar } from "@/store/use-chat-sidebar";

import { ChatHeader, ChatHeaderSkeleton } from "./chat-header";
import { ChatForm, ChatFormSkeleton } from "./chat-form";
import { ChatList, ChatListSkeleton } from "./chat-list";
import { ChatCommunity } from "./chat-community";

interface ChatProps {
    hostName: string;
    hostIdentity: string;
    viewerName: string;
    isFollowing: boolean;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
};

export const Chat = ({ hostName, hostIdentity, viewerName, isFollowing, isChatEnabled, isChatDelayed, isChatFollowersOnly }: ChatProps) => {
    const matches = useMediaQuery('(max-width: 1024px)');// if screen size is less than 1024px i.e on mobile device

    const { variant, onExpand } = useChatSidebar((state) => state);
    
    const connectionState = useConnectionState();
    const participant = useRemoteParticipant(hostIdentity); // get the stream host data from livekit
    const isOnline = participant && connectionState === ConnectionState.Connected;
    
    const isHidden = !isChatEnabled || !isOnline;

    const { chatMessages: messages, send } = useChat(); // it will fetch the chats from current livekit streaming

    const reversedMessages = useMemo(() => {
        return messages.sort((a, b) => b.timestamp - a.timestamp);
    }, [messages]); // latest messages on the bottom

    const [value, setValue] = useState("");

    const onSubmit = () => {
        if (!send) return;

        send(value);
        setValue("");
    };

    const onChange = (value: string) => {
        setValue(value);
    };

    useEffect(() => {
        if (matches) {
            onExpand();
        }
    }, [matches, onExpand]);

    return (
        <div className="flex flex-col bg-background border-l border-b pt-0 h-[calc(100vh-80px)]" >
            <ChatHeader/>
            {variant === ChatVariant.CHAT && (
                <>
                    <ChatList
                        messages={reversedMessages}
                        isHidden={isHidden}
                    />
                    <ChatForm
                        value={value}
                        onChange={onChange}
                        onSubmit={onSubmit}
                        isHidden={isHidden}
                        isDelayed={isChatDelayed}
                        isFollowing={isFollowing}
                        isFollowersOnly={isChatFollowersOnly}
                    />
                </>
            )}
            {variant === ChatVariant.COMMUNITY && (
                <ChatCommunity
                    viewerName={viewerName}
                    hostName={hostName}
                    isHidden={isHidden}
                />
            )}
        </div>
    )
}

export const ChatSkeleton = () => {
    return (
        <div className="flex flex-col border-l border-b pt-0 h-[calc(100vh-80px)] border-2">
            <ChatHeaderSkeleton />
            <ChatListSkeleton />
            <ChatFormSkeleton />
        </div>
    );
};