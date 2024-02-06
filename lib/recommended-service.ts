import { db } from "@/lib/db";
import { getSelf } from "./auth-service";

export const getRecommended = async () => {
    let userId;

    try {
        const self = await getSelf();
        userId = self.id;
    } catch {
        userId = null;
    }

    let users = [];


    if(userId){
        users = await db.user.findMany({
            where: { 
                AND:[
                    {// not the logged-in user
                        NOT: {
                            id: userId,
                        }
                    },
                    { // not followed by the logged-in user
                     // User -> NOT{followedBy=[Follow, Follow] -> for each Follow -> followerId : userId}
                        NOT: {
                            followedBy: {
                                some: {
                                    followerId: userId,
                                }
                            }
                        }
                    },
                    {// not blocked by the logged-in user
                     // User -> NOT{blocking = [Block, Block] -> for each Block -> blockedId : userId}   
                        NOT: {
                            blocking: {
                                some: {
                                    blockedId: userId,
                                },
                            },
                        },
                    }
                ],
            },
            select: {
                id: true,
                username: true,
                imageUrl:true,
                stream: {
                    select: {
                        isLive: true,
                    },
                },
            },
            orderBy: [
                {
                    stream: {
                        isLive: "desc",
                    }
                },
                {
                    createdAt: "desc"
                },
            ]
        })
    }else{
        users = await db.user.findMany({
            include: {
                stream: {
                    select: {
                        isLive: true,
                    },
                },
            },
            orderBy: [
                {
                    stream: {
                        isLive: "desc",
                    }
                },
                {
                    createdAt: "desc"
                },
            ]
        });
    }

    return users;
};
