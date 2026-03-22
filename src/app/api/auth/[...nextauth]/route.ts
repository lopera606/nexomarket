import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler: any = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
