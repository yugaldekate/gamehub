import { Toggle } from "./toggle";
import { Wrapper } from "./wrapper";
import { Navigation } from "./navigation";
import { getSelf } from "@/lib/auth-service";

export const Sidebar = async() => {

    const user = await getSelf();

    return (
        <Wrapper>
            <Toggle />
            <Navigation  user={user} />
        </Wrapper>
    );
};
