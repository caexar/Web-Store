import { CustomError } from "../error/custom.error";




export class UserEntity {
    constructor(
        public id:string,
        public name:string,
        public emailValidate:boolean,
        public email:string,
        public password:string,
        public role:string[],
        public img?:string,
    ){}

    
    //* creacion del objeto de mongo a mi entidad
    static fromObject( object: { [key:string]:any} ){
        const {id,_id,name,email,password,emailValidate,role,img}=object;

        //*validaciones con los custom errors
        if (!id &&!_id) throw CustomError.badRequest('missing id entity');
        if(!name) throw CustomError.badRequest('missing name entity');
        if(!email) throw CustomError.badRequest('missing email entity');
        if(!emailValidate===undefined) throw CustomError.badRequest('missing emailValidate entity');
        if(!password) throw CustomError.badRequest('missing password entity');
        if(!role) throw CustomError.badRequest('missing role entity');
    
        return new UserEntity(id || _id,name,emailValidate,email,password,role,img);
    }




}