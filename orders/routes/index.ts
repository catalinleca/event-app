import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/orders', async (re: Request, res: Response) => {
  res.send({})
})

export { router as indexOrderRouter };