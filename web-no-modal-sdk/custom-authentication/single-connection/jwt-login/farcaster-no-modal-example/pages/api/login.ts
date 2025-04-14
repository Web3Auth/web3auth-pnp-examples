import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse<{ token: string }>) {
  const { userData } = req.body;
  const privateKey = process.env.PRIVATE_KEY!;

  const jwtToken = jwt.sign(
    {
      sub: userData?.fid.toString(),
      name: userData?.displayName,
      username: userData?.username,
      profileImage: userData?.pfpUrl,
      custody: userData?.custody,
      aud: "w3a:farcaster-server",
      iss: "https://web3auth.io",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    privateKey,
    { algorithm: "RS256", keyid: "49563d7e86f6626426be" }
  );
  res.status(200).json({ token: jwtToken });
}
