import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { getPlantsWithPosition } from "@treeditor/lib/contentful/get-plants-with-position";
import { NextApiRequest, NextApiResponse } from "next";

async function getPlants(req: NextApiRequest, res: NextApiResponse) {
  const hasPositionQueryParam = req.query['has-position'];
  const hasPosition = Array.isArray(hasPositionQueryParam) ? hasPositionQueryParam[0] : hasPositionQueryParam;

  if (!hasPosition) {
    res.status(400).end();
    return;
  }

  try {
    const paginatedPlants = await getPlantsWithPosition();
    res.status(200).json(paginatedPlants);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getPlants(req, res);
    default:
      res.status(404).end();
  }
}

export default withApiAuthRequired(handler);