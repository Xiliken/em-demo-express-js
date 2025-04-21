import { Router } from 'express';
import { AppealsController } from '../controllers/appealsController.js';

export const createAppealsRoutes = (appealsService) => {
  const router = Router();
  const controller = new AppealsController(appealsService);

  router.post('/', controller.createAppealValidations, controller.createAppeal.bind(controller));
  router.patch('/:id/work', controller.startWorkValidations, controller.startWork.bind(controller));
  router.patch('/:id/complete', controller.completeAppealValidations, controller.completeAppeal.bind(controller));
  router.patch('/:id/cancel', controller.cancelAppealValidations, controller.cancelAppeal.bind(controller));
  router.get('/', controller.getAppealsValidations, controller.getAppeals.bind(controller));
  router.patch('/cancel-working', controller.cancelAllWorkingValidations, controller.cancelAllWorking.bind(controller));

  return router;
};
