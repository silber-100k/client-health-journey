import CredentialsProvider from "next-auth/providers/credentials";
import { userRepo } from "@/app/lib/db/userRepo";
import NextAuth from 'next-auth';

const authOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }
                const { email, password } = credentials;

                try {
                    const user = await userRepo.authenticate(email, password);
                    return user;
                } catch (error) {
                    console.log("error", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        error: '/signin',
        signIn: '/signin',
        signOut: '/signout',
    },
    session: {
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token
                token.name = user.name;
                token.email = user.email;
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };