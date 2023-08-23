import S3 from "aws-sdk/clients/s3";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env/server.mjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const s3 = new S3({
    apiVersion: "2006-03-01",
    endpoint: "https://storage.yandexcloud.net",
  });

  const key = `skinlike/${Date.now()}/${req.query.file}`;
  const fileurl = `${env.BUCKET_DOMAIN}/${key}`;

  const post = s3.createPresignedPost({
    Bucket: env.BUCKET_NAME,
    Fields: {
      key,
      "Content-Type": req.query.fileType,
    },
    Expires: 60,
    Conditions: [
      ["content-length-range", 0, 1048576], // up to 1 MB
    ],
  });

  res.status(200).json({ ...post, key, fileurl });
}
