


export class CustomError extends Error{
    private constructor(
        public readonly statusCode:number,
        public readonly message: string,
    ){
        //* llama al constructor de la clase padre y le pasa el message
        super(message);
    }

    //* la clase crea la instancia y le pasa sus parametros
    static badRequest(message:string){
        return new CustomError(400,message);
    };

    static unAuthorized(message:string){
        return new CustomError(401,message);
    };

    static forbidden(message:string){
        return new CustomError(403,message);
    };

    static notFound(message:string){
        return new CustomError(404,message);
    };

    static internalServer(message:string){
        console.log(message);
        return new CustomError(500,message);
    };


}