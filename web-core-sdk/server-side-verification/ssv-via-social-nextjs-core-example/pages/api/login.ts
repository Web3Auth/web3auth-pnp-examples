// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import * as jose from 'jose'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const idToken = req.headers.authorization?.split(' ')[1] || ''
    const app_pub_key = req.body.appPubKey
    
    const jwks = jose.createRemoteJWKSet(
      new URL('https://api.openlogin.com/jwks'),
    )
    const jwtDecoded = await jose.jwtVerify(idToken, jwks, {
      algorithms: ['ES256'],
    });
    if ((jwtDecoded.payload as any).wallets[0].public_key == app_pub_key) {
      // Verified
      res.status(200).json({name: 'Validation Success'})
    } else {
      res.status(400).json({name: 'Failed'})
    }
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}
