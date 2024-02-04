import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

export const getFollowedUsers = async () => {
  try {
    const self = await getSelf();

    const followedUsers = db.follow.findMany({
        where: {
            followerId: self.id, //if logged-in user is following the other user
            following: {        //checking if the other user has blocked the logged-in user
                blocking: {
                    none: {
                        blockedId: self.id,
                    },
                },
            },
        },
        include: {
            following: {
                include: {
                    stream: {
                        select: {
                            isLive: true,
                        },
                    },
                },
            },
        },
        orderBy: [
            {
                following: {
                    stream: {
                        isLive: "desc",
                    },
                },
            },
            {
                createdAt: "desc"
            },
        ]
    });

        return followedUsers;
    } catch {
        return [];
    }
};

//checking if current logged-in user is following the otherUser
export const isFollowingUser = async (id: string) => {
    try {
        const self = await getSelf();
    
        const otherUser = await db.user.findUnique({
            where: { 
                id: id,
            },
        });
    
        if (!otherUser) {
            throw new Error("User not found");
        }
    
        if (otherUser.id === self.id) {
            return true;
        }
        
        
        const existingFollow = await db.follow.findFirst({
            where: {
                followerId: self.id,
                followingId: otherUser.id,
            },
        });
    
        return !!existingFollow;
    } catch {
        return false;
    }
};

// Current logged-in user follow otherUser
export const followUser = async (id: string) => {
    const self = await getSelf();
  
    const otherUser = await db.user.findUnique({
        where: { 
            id: id,
        },
    });
  
    if (!otherUser) {
        throw new Error("User not found");
    }
  
    if (otherUser.id === self.id) {
      throw new Error("Cannot follow yourself");
    }
  
    const existingFollow = await db.follow.findFirst({
        where: {
            followerId: self.id,
            followingId: otherUser.id,
        },
    });
  
    if (existingFollow) {
      throw new Error("Already following");
    }
  
    const follow = await db.follow.create({
        data: {
            followerId: self.id,
            followingId: otherUser.id,
        },
        include: {
            follower: true,
            following: true,
        },
    });
  
    return follow;
};

// Current logged-in user unfollow otherUser
export const unfollowUser = async (id: string) => {
    const self = await getSelf();
  
    const otherUser = await db.user.findUnique({
        where: {
            id: id,
        },
    });
  
    if (!otherUser) {
        throw new Error("User not found");
    }
  
    if (otherUser.id === self.id) {
        throw new Error("Cannot unfollow yourself");
    }
  
    const existingFollow = await db.follow.findFirst({
        where: {
            followerId: self.id,
            followingId: otherUser.id,
        },
    });
  
    if (!existingFollow) {
        throw new Error("Not following");
    }
  
    const follow = await db.follow.delete({
        where: {
            id: existingFollow.id,
        },
        include: {
            following: true,
        },
    });
  
    return follow;
};
