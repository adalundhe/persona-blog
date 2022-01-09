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

    const weatherResponse = await utils.content.getLocationWeather({
        latitude: req.query.latitude as string,
        longitude: req.query.longitude as string
    });

    return await res.status(200).json(weatherResponse);

}