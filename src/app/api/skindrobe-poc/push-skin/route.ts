import EasyYandexS3 from "easy-yandex-s3";
import { NextRequest, NextResponse } from "next/server";
import { env } from "~/env/server.mjs";
import { getCurrentSession } from "~/server/api/sessions";
import { getFirebase } from "~/server/firebase";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session.user) return new NextResponse(undefined, { status: 401 });
  if (!session.user.nickname)
    return new NextResponse(undefined, { status: 400 });
  const body = await req.formData();
  const file = body.get("file") as File;
  if (!file) return new NextResponse(undefined, { status: 400 });

  const s3 = new EasyYandexS3({
    auth: {
      accessKeyId: env.YANDEX_CLOUD_ID,
      secretAccessKey: env.YANDEX_CLOUD_SECRET,
    },
    Bucket: env.YANDEX_CLOUD_BUCKET,
    debug: env.NODE_ENV === "development",
  });
  const res = await s3.Upload(
    {
      buffer: Buffer.from(await file.arrayBuffer()),
      name: `${Date.now()}.png`,
    },
    `/skindrobepoc/${session.user.id}`,
  );
  if (!res) return new NextResponse(undefined, { status: 500 });

  const url = (res as any).Location as string;

  const firebase = await getFirebase();
  const db = firebase.firestore();

  try {
    await db.collection("poc-skins").doc(session.user.nickname).set({ url });
  } catch (e) {
    return new NextResponse(undefined, { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}
