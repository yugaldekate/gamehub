"use client"

import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import { ConnectionState } from "livekit-client";
import { useChat, useConnectionState, useRemoteParticipant } from "@livekit/components-react";

import { ChatVariant ,useChatSidebar } from "@/store/use-chat-sidebar";

import { ChatHeader } from "./chat-header";
import { ChatForm } from "./chat-form";
import { ChatList } from "./chat-list";

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
        </div>
    )
}