import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const nickname = req.query.nickname;
  const format = req.query.format || "buffer";
  if (!["url", "buffer"].includes(format.toString()))
    return res.status(400).end();

  if (!nickname || typeof nickname != "string") return res.status(400).end();

  const user = await prisma.user.findUnique({
    where: {
      nickname,
    },
    include: {
      avatarCharacter: true,
    },
  });
  if (!user) return res.status(404).end();
  if (!user.avatarCharacter) return res.status(404).end();

  if (format == "buffer") {
    const skinData = (
      await axios({
        url: user.avatarCharacter.skin,
        responseType: "arraybuffer",
      })
    ).data;
    res.status(200).end(skinData);
  } else {
    res.status(200).json({ url: user.avatarCharacter.skin });
  }
}
