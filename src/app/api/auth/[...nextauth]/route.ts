import { handlers, handler } from "@/lib/auth";

// Support both NextAuth v4 (handler is a function) and v5 (handlers.GET/POST)
const GET = handlers?.GET || handler;
const POST = handlers?.POST || handler;

export { GET, POST };
