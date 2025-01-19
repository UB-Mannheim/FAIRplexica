import NextAuth from "next-auth";
import { authOptions } from "./authOptions"; 

const handler = NextAuth(authOptions);

// Export only valid method handlers:
export { handler as GET, handler as POST };
