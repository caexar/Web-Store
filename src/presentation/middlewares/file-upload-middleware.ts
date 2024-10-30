import { NextFunction, Request, Response } from "express";


export class FileUploadMiddleware{
    constructor(){}

    static containtFile(req:Request,res:Response,next:NextFunction){

        if (!req.files || Object.keys(req.files).length===0) {
            return res.status(400).json({error:'No files were selected'});
        }

        //*si no es un arreglo lo convierto y lo asigno al req.body.files
        if (!Array.isArray(req.files.file)) {
            req.body.files=[req.files.file];
        }else{
            //*si es un arreglo solo lo asigno al req.body.files
            req.body.files = req.files.file;
        }
        next();
    }
}