import { compareSync, genSaltSync, hashSync } from 'bcryptjs';



export class bcryptAdapter {

    //!no quiero dependencias entonces no incializo el const
    //! Y POR ESO USO METODOS ESTATICOS

    //* un metodo que recibe el password como string y cifra el password
    static hash (password:string) {

        //* genera el salt que es un valor aleatorio que se le agrega
        const salt = genSaltSync();

        //* cifra el password utilizando el salt  y retorna la version cifrada
        //*(hash) del password
        return hashSync(password,salt)
    };


    
    //*metodo que recibe el password en string y el hasheo  y lo compara 
    //*con su version cifrada (hash)
    static compare (password:string,hashed:string){
        return compareSync(password,hashed);
    };
}
