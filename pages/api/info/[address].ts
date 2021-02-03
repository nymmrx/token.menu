import { NextApiRequest as Req, NextApiResponse as Res } from "next";

export default async (req: Req, res: Res): Promise<void> => {
  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies,
  });
};
