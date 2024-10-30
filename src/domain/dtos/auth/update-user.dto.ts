



export class UpdateUserDto {

    private constructor(
        public readonly name:string,
        public readonly email:string,
        public readonly password:string,
        public readonly role:string
    ){}

    static create(object:{[key:string]:any}):[string?,UpdateUserDto?]{

        const {name,email,password,role}=object;

        if (!email) return ['missing email dto',undefined]; 

        return [undefined,new UpdateUserDto(name,email,password,role)];
    } 
}