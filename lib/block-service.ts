import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

//checking if currently logged-in user is blocked by other user
export const isBlockedByUser = async (id: string) => {
    try {
        const self = await getSelf();

        const otherUser = await db.user.findUnique({
            where: { 
                id: id,
            }
        });

        if (!otherUser) {
            throw new Error("User not found");
        }

        if (otherUser.id === self.id) {
            return false;
        }

        const existingBlock = await db.block.findUnique({
            where: {
                blockerId_blockedId: {//index created in Block model @@unique([blockerId, blockedId])
                    blockerId: otherUser.id,
                    blockedId: self.id,
                },
            },
        });

        return !!existingBlock;
    } catch {
        return false;
    }
};

//currently logged-in user is blocking the other user
export const blockUser = async (id: string) => {
    const self = await getSelf();
  
    if (self.id === id) {
        throw new Error("Cannot block yourself");
    }
  
    const otherUser = await db.user.findUnique({
        where: { 
            id: id,
        }
    });
  
    if (!otherUser) {
        throw new Error("User not found");
    }
  
    const existingBlock = await db.block.findUnique({
        where: {
            blockerId_blockedId: {//index created in Block model @@unique([blockerId, blockedId])
                blockerId: self.id,
                blockedId: otherUser.id,
            },
        },
    });
  
    if (existingBlock) {
        throw new Error("Already blocked");
    }
  
    const block = await db.block.create({
        data: {
            blockerId: self.id,
            blockedId: otherUser.id,
        },
        include: {
            blocked: {
                select: {
                    username: true,
                }
            },
        },
    });
  
    return {success : block.blocked.username};
};
  
//currently logged-in user is un-blocking the other user
export const unblockUser = async (id: string) => {
    const self = await getSelf();
  
    if (self.id === id) {
        throw new Error("Cannot unblock yourself");
    }
  
    const otherUser = await db.user.findUnique({
        where: { id },
    });
  
    if (!otherUser) {
        throw new Error("User not found");
    }
  
    const existingBlock = await db.block.findUnique({
        where: {
            blockerId_blockedId: {//index created in Block model @@unique([blockerId, blockedId])
                blockerId: self.id,
                blockedId: otherUser.id,
            },
        },
    });
  
    if (!existingBlock) {
        throw new Error("Not blocked");
    }
  
    const unblock = await db.block.delete({
        where: {
            id: existingBlock.id,
        },
        include: {
            blocked: {
                select: {
                    username: true,
                }
            },
        },
    });
  
    return {success : unblock.blocked.username};
};

//get all the users blocked by the currently logged-in user
export const getBlockedUsers = async () => {
    const self = await getSelf();
  
    const blockedUsers = await db.block.findMany({
        where: {
            blockerId: self.id,
        },
        include: {
            blocked: true,
        },
    });
  
    return blockedUsers;
};