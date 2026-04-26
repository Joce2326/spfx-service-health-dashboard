import { Router, Request, Response } from 'express';
import { ServiceHealthService } from '../services/serviceHealthService';

const router = Router();
const serviceHealthService = new ServiceHealthService();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await serviceHealthService.getServiceHealth();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting service health data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;