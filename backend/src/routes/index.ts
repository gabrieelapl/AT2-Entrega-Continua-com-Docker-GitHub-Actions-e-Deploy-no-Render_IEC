import { Router } from 'express';
import { filmeRoutes } from './filmeRoutes';
import { healthRoutes } from './healthRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/filmes', filmeRoutes);

export { router as appRoutes };