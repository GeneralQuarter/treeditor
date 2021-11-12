import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { getRectanglesByPartialLabel } from '@treeditor/lib/contentful/get-rectangles-by-partial-label';
import { getRectanglesWithCoords } from '@treeditor/lib/contentful/get-rectangles-with-coords';
import { NextApiRequest, NextApiResponse } from 'next';

async function getAllWithCoords(res: NextApiResponse) {
  try {
    const paginatedRectangles = await getRectanglesWithCoords();
    res.status(200).json(paginatedRectangles);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function getAllByLabel(partialLabel: string, res: NextApiResponse) {
  try {
    const paginatedRectangles = await getRectanglesByPartialLabel(partialLabel);
    res.status(200).json(paginatedRectangles);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const hasCoordsQueryParam = req.query['has-coords'];
  const hasCoords = Array.isArray(hasCoordsQueryParam) ? hasCoordsQueryParam[0] : hasCoordsQueryParam;

  const partialLabelQueryParam = req.query['partial-label'];
  const partialLabel = Array.isArray(partialLabelQueryParam) ? partialLabelQueryParam[0] : partialLabelQueryParam;

  if (!hasCoords && partialLabel === undefined) {
    res.status(400).end();
    return;
  }

  if (partialLabel !== undefined) {
    return getAllByLabel(partialLabel, res);
  }

  return getAllWithCoords(res);
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