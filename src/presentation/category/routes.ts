import { Router } from 'express';
import { CategoryController } from './controller';
import { CategoryServices } from '../services';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';




export class CategoryRoutes {


  static get routes(): Router {

    const router = Router();
    const services= new CategoryServices();
    const controller = new CategoryController(services);

    // Definir las rutas
     router.get('/', controller.getCategories);
     router.post('/',[AuthMiddlewares.validatejwt],controller.createCategory);




    return router;
  }


}