import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        token?: string,
        refreshToken?: string,
        user: {
            username?: string,
        } & DefaultSession["user"],
        provider?: string,
    }

    interface User {
        token?: string,
        refreshToken?: string,
        username?: string,
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        jwt?: string;
        refreshToken?: string;
        username?: string;
        provider?: string;
    }
}