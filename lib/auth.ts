// Required env vars: NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL
// Generate NEXTAUTH_SECRET with: openssl rand -base64 32
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid email or password');
        }

        // Perform real database query lookup
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password');
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan
        } as any;
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = (user as any).role || 'user';
        token.plan = (user as any).plan || 'free';
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session?.user) {
        (session.user as any).role = token.role || 'user';
        (session.user as any).plan = token.plan || 'free';
      }
      return session;
    }
  }
};
