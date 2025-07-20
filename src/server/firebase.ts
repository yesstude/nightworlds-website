import Firebase from "firebase-admin";
import { cert } from "firebase-admin/app";
import { env } from "~/env/server.mjs";

export async function getFirebase(): Promise<Firebase.app.App> {
  if (!env.FIREBASE_JSON_CERT) throw new Error("FIREBASE_JSON_CERT is not set");
  if (!(globalThis as any).firebase) {
    (globalThis as any).firebase = Firebase.initializeApp({
      credential: cert(env.FIREBASE_JSON_CERT),
    });
  }
  return (globalThis as any).firebase;
}
