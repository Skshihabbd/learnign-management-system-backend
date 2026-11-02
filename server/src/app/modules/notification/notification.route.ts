import { Router } from 'express';
import { sendNotification } from './notification.controller';

const router = Router();

router.post('/send', sendNotification);

export const NotificationRoutes : Router =router;