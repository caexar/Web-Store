import { Router } from 'express';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';
import { PorductsController } from './controller';
import { ProductsServices } from '../services/products.services';




export class ProductsRoutes {


  static get routes(): Router {

    const router = Router();

    //*traer el servicio
    const service= new ProductsServices()
    //* traigo el controlador
    const controller = new PorductsController(service);
    
    // Definir las rutas
     router.get('/',controller.getProducts );
     router.post('/',[AuthMiddlewares.validatejwt],controller.createProducts);
    



    return router;
  }


}