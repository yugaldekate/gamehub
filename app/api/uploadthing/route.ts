//Reference : https://docs.uploadthing.com/getting-started/

import { createRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});