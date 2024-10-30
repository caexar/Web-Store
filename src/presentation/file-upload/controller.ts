import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.services";
import { UploadedFile } from "express-fileupload";






export class FileUploadController{
    constructor(
        private readonly fileuploadservice:FileUploadService
    ){}

    private handleError = (error:unknown,res:Response)=>{
        if (error instanceof(CustomError)) {
            return res.status(error.statusCode).json({error:error.message});
        }
        console.log(error)
        return res.status(500).json({error:'internal server error'});
    };

    uploadFile = (req:Request,res:Response)=>{
        
        const file = req.body.files.at(0) as UploadedFile;
        console.log(req.params.type);
        this.fileuploadservice.uploadSingle( file, `uploads/${req.params.type}`)
            .then(uploaded=>res.json(uploaded))
            .catch(error=> this.handleError(error,res));

    };

    uploadMutiFile = (req:Request,res:Response)=>{

        const files = req.body.files as UploadedFile[];
        console.log('prueba',req.params.type);
        this.fileuploadservice.UploadMultiple(files,`uploads/${req.params.type}`)
            .then(uploads=> res.status(200).json({uploads}))
            .catch(error=> this.handleError(error,res));
    };
}