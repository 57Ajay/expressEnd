import { Router } from 'express';

import usersRouter from './usersRouter.mjs';
import productsRouter from './productsRouter.mjs';

const router = Router();

router.use(usersRouter);
router.use(productsRouter);

export default router;
