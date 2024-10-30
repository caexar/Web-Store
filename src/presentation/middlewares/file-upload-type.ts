import { NextFunction, Request, Response } from "express";


export class FileUploadTypeMiddleware{

    static UploadType(validTypes:string[]){

        return (req:Request,res:Response,next:NextFunction)=>{
            //* si es asi debe colocarse en medio de la ruta para aplicar el middleware
           //const type= req.params.type;

           //* como estoy aplicando antes de que pase por la ruta entonces
           const type = req.url.split('/').at(2) ?? '';

      
           if (!validTypes.includes(type)) {
                return res.status(400).json({error:'type not valid'});
           }

           next();

        }
    }
};