import { corsMiddleware } from 'server/services';
import { NextApiRequest, NextApiResponse } from "next";
import utils from 'utils';

export const config = {
  api: {
    bodyParser: true,
  },
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    await corsMiddleware.executeCors(req, res, corsMiddleware.settings);

    const postsReponse = await utils.devTo.getLatestPosts({
      count: (req.query.count as string || "5")
    });

    if (postsReponse.props.error){
      return await res.status(500).json(postsReponse);
    }

    return await res.status(200).json(postsReponse)

}