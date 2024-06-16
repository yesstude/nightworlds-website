import { NextRequest } from "next/server";

async function handler(req: NextRequest) {
  const url = new URL(req.url);
  url.pathname = "/worlds/medium";
  return Response.redirect(url.toString());
}

export { handler as GET, handler as POST };
