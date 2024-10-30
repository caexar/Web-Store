import { regularExps } from "../../../config";





export class RegisterUserDto {

    private constructor(
        public readonly name:string,
        public readonly email:string,
        public readonly password: string,
    ){}

    static create(object: {[key:string]:any}):[string?,RegisterUserDto?]{

        const {name,email,password}= object;

        if (!name) return ['missing name',undefined];
        if (!email) return ['missing email',undefined];
        if (!regularExps.email.test(email)) return ['Email is not valid',undefined];
        if (!password) return ['missing password',undefined];
        if (password.length < 6) return ['Password too short',undefined];

        return[undefined,new RegisterUserDto(name,email,password)];
    }
}






