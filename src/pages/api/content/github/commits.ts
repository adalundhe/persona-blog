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

    const commitsResponse = await utils.content.getLatestCommits({
      count: parseInt(req.query.count as string ?? "1")
    });

    return await res.status(200).json(commitsResponse)

}