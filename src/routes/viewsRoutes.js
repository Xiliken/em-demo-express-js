import { Router } from 'express';
import { ViewsController } from '../controllers/viewsController.js';

export const createViewsRoutes = () => {
  const router = Router();
  const controller = new ViewsController();

  console.log('Registering view routes...');
  router.get('/', controller.renderHome.bind(controller));
  router.get('/appeals', controller.renderAppeals.bind(controller));
  router.get('/cancel-all', controller.renderCancelAll.bind(controller));

  return router;
};
