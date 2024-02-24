import {getServerSession, type NextAuthOptions,} from "next-auth";
//import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
//import { GithubProfile } from 'next-auth/providers/github'
//import {} fron 

import { db } from "@/lib/db";
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { error } from 'console'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
    adapter:PrismaAdapter(db),
    secret:process.env.NEXTAUTH_SECRET,
    session:{
        strategy:'jwt',
    },
    pages: {
        signIn: "/auth/signin",
      },
    providers: [
       /* GitHubProvider({
            profile(profile: GithubProfile) {
                //console.log(profile)
                return {
                    ...profile,
                    role: profile.role ?? "user",
                    id: profile.id.toString(),
                    image: profile.avatar_url,
                }
            },
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),*/
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "habibtest@testmail.com.com" },
                password: { label: "Password", type: "password" },
            },
            
            //authorize function
            async authorize(credentials) {
                // This is where you need to retrieve user data 
                // to verify with credentials
                // Docs: https://next-auth.js.org/configuration/providers/credentials
                //const user = { id: "42", name: "Dave", email:"vacaytrip.com@gmail.com", password: "nextauth", role: "manager" }

            try{
                console.log("Authorize function recieved credentials:", credentials);
          
                // Check if user credentials are they are Not empty
                if (!credentials?.email || !credentials?.password) {
                  throw { error: "No Inputs Found", status: 401 };
                }

                console.log("Passed Check 1 ");
                //Check if user exists
                const existingUser = await db.user.findUnique({
                  where: { email: credentials.email },
                });
                if (!existingUser) {
                  console.log("No user found");
                  throw { error: "No user found", status: 401 };
                }
                console.log("Passed Check 2");

                //Check if Password is correct
                const passwordMatch = await compare(
                  credentials.password,
                  existingUser.hashedPassword
                );

                if (!passwordMatch) {
                    console.log("Password incorrect");
                    throw { error: "Password Incorrect", status: 401 };
                }

                console.log("Pass 3 Checked");
                const user = {
                    id: existingUser.id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                    image: existingUser.image,
                    emailVerified: existingUser.emailVerified,
                };

                //
                console.log("User Compiled");
                console.log(user);
                return user;

                } catch(error)  {

                    console.log("aLL Failed");
                    console.log(error);
                    throw { error: "Something went wrong", status: 401 };
                } 

           
                  


            }

            //end of authorize
        })
    ],
    callbacks: {
        async session({ session, token }) {
          if (token) {
            console.log(`token:${token} in session`);
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.role = token.role;
            session.user.image = token.picture;
            session.user.emailVerified = token.emailVerified;
          }
          console.log(`session:${session.user}`);
          return session;
        },
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
            token.name = user.name;
            token.email = user.email;
            token.role = user.role;
            token.image = user.picture;
            token.emailVerified = user.emailVerified;
          }
          console.log(`token:${token}`);
          return token;
        },
      },
}