"use client";

import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";

interface ContainerProps {
  children: React.ReactNode;
};

export const Container = ({children} : ContainerProps) => {
    
    const matches = useMediaQuery("(max-width: 1024px)");// if screen size less than 1024px
    const { collapsed, onCollapse, onExpand } = useSidebar((state) => state);

    useEffect(() => {
        if (matches) {
            onCollapse();//on Mobile
        } else {
            onExpand();//on Desktop
        }
    }, [matches, onCollapse, onExpand]);

    return (
        <div className={cn("flex-1 transition-all", collapsed ? "ml-[70px]" : "lg:ml-60")}>
            {children}
        </div>
    );
}