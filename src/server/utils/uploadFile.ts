import S3 from "aws-sdk/clients/s3";
import { env } from "../../env/server.mjs";

function getS3(): S3 {
  const s3 =
    (globalThis as any).s3 ||
    new S3({
      apiVersion: "2006-03-01",
      endpoint: "https://storage.yandexcloud.net",
    });
  (globalThis as any).s3 = s3;
  return s3;
}

export type FileType = "skinlike" | "previews" | "temp";

export const uploadFile = async (
  filetype: FileType,
  data: Buffer,
  name: string
): Promise<string> => {
  const s3 = getS3();

  const key = `${filetype}/${Date.now()}/${name}`;
  const fileurl = `${env.BUCKET_DOMAIN}/${key}`;

  const res = await s3
    .upload({
      Bucket: env.BUCKET_NAME,
      Key: key,
      Body: data,
    })
    .promise()
    .catch(() => {});

  return fileurl;
};
