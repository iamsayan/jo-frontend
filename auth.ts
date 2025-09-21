import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Facebook,
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                try {
                    const response = await fetch(
                        `${process.env.API_URL}/auth/${account.provider}/callback?access_token=${account.access_token}`
                    );
                    const data = await response.json();
                    if (!data?.jwt) {
                        throw new Error('Google login failed');
                    }

                    token.jwt = data.jwt;
                    token.id = data.user.id;
                } catch (error) {
                    console.error("Error in JWT callback:", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.jwt = token.jwt as string;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
})