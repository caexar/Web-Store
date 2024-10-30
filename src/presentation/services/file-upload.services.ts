import { UploadedFile } from "express-fileupload";
import path from 'path';
import fs from 'node:fs';
import { UuidAdparter } from "../../config";
import { CustomError } from "../../domain";




export class FileUploadService {

    constructor(
        private readonly uuid= UuidAdparter.v4,
    ){}



    private checkFolder(folderpath:string){
    if (!fs.existsSync(folderpath)) {
        fs.mkdirSync(folderpath,{recursive:true});
    }else{
        return true;
    }
    };

    async uploadSingle(
        file:UploadedFile,
        folder:string='uploads',
        validExtensions:string[]=['png','jpg','jpeg','gif']
    ){  
        //*mimetype: image/jpeg
        //* entonces dividimos por el / con split y agarramos la segunda posicion con at
        const fileExtension=file.mimetype.split('/').at(1) ?? '';

        if (!validExtensions.includes(fileExtension)) {
            throw CustomError.
            badRequest(`invalid extension ${fileExtension}, valid ones ${validExtensions}`);

        }

        
        try {
            //*dirname = carpeta actual = path completo hasta aqui
            //*../../../ = salir de this carpeta 3 niveles donde se encuentra el uploads
            //* folder es uploads o el nombre del lugar a guardar
            const destination = path.resolve(__dirname,'../../../',folder);
            console.log(destination);
            this.checkFolder(destination);

            const fileName=`${this.uuid()}.${fileExtension}`;
            
            file.mv(`${destination}/${fileName}`);
            console.log(fileName)
            return {fileName};


        } catch (error) {
            throw error
        }
    };

    async UploadMultiple(
        files:UploadedFile[],
        folder:string='uploads',
        validExtensions:string[]=['png','jpg','jpeg','gif'],
    ){

    const filesNames = await Promise.all(
        files.map(file=>this.uploadSingle(file,folder,validExtensions)));
        return filesNames;
    };
    


}