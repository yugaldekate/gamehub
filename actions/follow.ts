"use server";

import { revalidatePath } from "next/cache";

import { followUser, unfollowUser } from "@/lib/follow-service";

export const onFollow = async (id: string) => {
    try {
        const followedUser = await followUser(id);

        revalidatePath("/");

        if (followedUser) {
            revalidatePath(`/${followedUser.success}`);
        }

        return followedUser;
    } catch (error) {
        throw new Error("Interal Error");
    };
};

export const onUnfollow = async (id: string) => {
    try {
        const unfollowedUser = await unfollowUser(id);
    
        revalidatePath("/");
    
        if (unfollowedUser) {
            revalidatePath(`/${unfollowedUser.success}`)
        }
    
        return unfollowedUser;
    } catch (error) {
        throw new Error("Internal Error");
    }
}
