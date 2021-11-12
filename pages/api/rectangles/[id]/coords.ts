import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { updateRectangleCoords } from '@treeditor/lib/contentful/update-rectangle-coords';
import { NextApiRequest, NextApiResponse } from 'next';

async function patchRectangleCoords(req: NextApiRequest, res: NextApiResponse) {
  const idQueryParam = req.query.id;
  const id = Array.isArray(idQueryParam) ? idQueryParam[0] : idQueryParam;

  if (!id) {
    res.status(404).end();
    return;
  }

  try {
    const result = await updateRectangleCoords(id, JSON.parse(req.body));
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case 'PUT':
    return patchRectangleCoords(req, res);
  default:
    res.status(404).end();
  }
}

export default withApiAuthRequired(handler);