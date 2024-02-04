import { db } from "@/lib/db"

export const getUserByUsername = async (username: string) => {
    const user = await db.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true,
            bio: true,
            username: true,
            imageUrl: true,
            externalUserId: true,
            stream: {
                select: {
                    id: true,
                    name: true,
                    isLive: true,
                    thumbnailUrl: true,
                    isChatDelayed: true,
                    isChatEnabled: true,
                    isChatFollowersOnly: true,
                },
            },
            _count: {
                select: {
                    followedBy: true,
                },
            },
        },
    });
  
    return user;
};

export const getUserById = async (id: string) => {
    const user = await db.user.findUnique({
        where: { 
            id : id,
        },
    });
  
    return user;
};