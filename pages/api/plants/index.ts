import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { getPlantsWithPosition } from '@treeditor/lib/contentful/get-plants-with-position';
import { getPlantsByPartialCode } from '@treeditor/lib/contentful/get-plants-by-partial-code';
import { NextApiRequest, NextApiResponse } from 'next';

async function getAllWithPosition(res: NextApiResponse) {
  try {
    const paginatedPlants = await getPlantsWithPosition();
    res.status(200).json(paginatedPlants);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getAllByPartialCode(partialCode: string, res: NextApiResponse) {
  try {
    const paginatedPlants = await getPlantsByPartialCode(partialCode);
    res.status(200).json(paginatedPlants);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const hasPositionQueryParam = req.query['has-position'];
  const hasPosition = Array.isArray(hasPositionQueryParam) ? hasPositionQueryParam[0] : hasPositionQueryParam;

  const partialCodeQueryParam = req.query['partial-code'];
  const partialCode = Array.isArray(partialCodeQueryParam) ? partialCodeQueryParam[0] : partialCodeQueryParam;

  if (!hasPosition && partialCode === undefined) {
    res.status(400).end();
    return;
  }

  if (partialCode !== undefined) {
    return getAllByPartialCode(partialCode, res);
  }

  return getAllWithPosition(res);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case 'GET':
    return get(req, res);
  default:
    res.status(404).end();
  }
}

export default withApiAuthRequired(handler);