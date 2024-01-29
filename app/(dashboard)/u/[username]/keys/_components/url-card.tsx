import { CopyButton } from "./copy-button";

import { Input } from "@/components/ui/input";

interface UrlCardProps {
    value: string | null;
};

export const UrlCard = ({ value }: UrlCardProps) => {
    return (
        <div className="rounded-xl bg-muted p-6">
            <div className="flex items-start gap-x-10 max-lg:flex-col">
                <p className="font-semibold shrink-0">
                    Server URL
                </p>
                <div className="space-y-2 w-full">
                    <div className="w-full flex items-center gap-x-2">
                        <Input
                            value={value || ""}
                            disabled
                            placeholder="Server URL"
                        />
                        <CopyButton
                            value={value || ""}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
