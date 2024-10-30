import { Router } from "express"
import { FileUploadService } from "../services/file-upload.services";
import { FileUploadController } from "./controller";
import { FileUploadMiddleware } from "../middlewares/file-upload-middleware";
import { FileUploadTypeMiddleware } from "../middlewares/file-upload-type";



export  class FileUploadRoutes{

    //* metodo estatic get que devuelve un router
    static get routes(): Router {
        //*se asigna el router
        const router=Router();
        //*se llama el servicio y al controlador
        const service= new FileUploadService();
        const controller = new FileUploadController(service);

        //? middlewares que se aplican a las dos rutas
        router.use(FileUploadMiddleware.containtFile);
        router.use(FileUploadTypeMiddleware.UploadType(['users','categories','products']));

        //*se generan las rutas con el router
        router.post('/single/:type', controller.uploadFile );
        router.post('/multiple/:type', controller.uploadMutiFile);
        



        return router;


       
    }

}