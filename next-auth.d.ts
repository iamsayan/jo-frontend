import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            jwt?: string,
        } & DefaultSession["user"]
    }

    interface User {
        jwt?: string,
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        jwt?: string;
    }
}