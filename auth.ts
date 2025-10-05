import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Facebook,
        Credentials({
            name: 'Email',
            credentials: {
                email: { label: "Email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const response = await fetch(`${process.env.API_URL}/auth/local`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        identifier: credentials?.email,
                        password: credentials?.password,
                    }),
                    cache: 'no-cache',
                })
                const data = await response.json();
                if (!response.ok || !data?.jwt) {
                    return null;
                }

                return {
                    id: String(data.user.id),
                    email: data.user.email,
                    name: data.user.username || data.user.email,
                    username: data.user.username,
                    token: data.jwt,
                    refreshToken: data.refreshToken,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                if (account.provider === 'credentials') {
                    token.jwt = user.token;
                    token.id = user.id;
                    token.username = user.username;
                    token.refreshToken = user.refreshToken;
                } else {
                    try {
                        const response = await fetch(
                            `${process.env.API_URL}/auth/${account.provider}/callback?access_token=${account.access_token}`,
                            { cache: 'no-cache' }
                        );
                        const data = await response.json();
                        if (!data?.jwt) {
                            throw new Error(`${account.provider} login failed`);
                        }

                        token.jwt = data.jwt;
                        token.refreshToken = data.refreshToken;
                        token.id = data.user.id;
                        token.username = data.user.username;
                    } catch (error) {
                        console.error("Error in JWT callback:", error);
                    }
                }

                token.provider = account.provider;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.token = token.jwt as string;
                session.refreshToken = token.refreshToken as string;
                session.provider = token.provider as string;
                session.user.id = token.id as string;
                session.user.username = token.username as string;
            }
            return session;
        },
    },
})