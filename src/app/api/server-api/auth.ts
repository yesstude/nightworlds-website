import { SHA256, enc } from "crypto-js";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { BaseServer, serversTable } from "~/server/db/schema";

export async function serverProtected(
  handler: (
    server: BaseServer,
  ) => Promise<NextResponse | void> | NextResponse | void,
) {
  try {
    const header = headers().get("Authorization");
    if (!header) throw new ServerUnauthenticatedError();
    if (!header.startsWith("Bearer ")) throw new ServerUnauthenticatedError();
    const key = header.slice(7);
    const keyHash = enc.Base64.stringify(SHA256(enc.Utf8.parse(key)));

    const [server] = await db
      .select()
      .from(serversTable)
      .where(eq(serversTable.apiKeyHash, keyHash))
      .limit(1);

    if (!server) throw new ServerUnauthenticatedError();

    const res = await handler(server!);
    if (!res)
      return NextResponse.json({ code: 200, message: "OK" }, { status: 200 });
    return res;
  } catch (error) {
    if (error instanceof ServerUnauthenticatedError) {
      return NextResponse.json(
        { code: 401, message: "Unauthorized" },
        { status: 401 },
      );
    } else {
      console.error(error);
      return NextResponse.json(
        { code: 500, message: "Internal server error" },
        { status: 500 },
      );
    }
  }
}

export class ServerUnauthenticatedError extends Error {
  public name = "ServerUnauthenticatedError";
  public message: string = "Server is not authenticated";
  constructor() {
    super();
  }
}
