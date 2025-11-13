import type { auth } from "@court-case-law/auth";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	plugins: [inferAdditionalFields<typeof auth>()],
});
