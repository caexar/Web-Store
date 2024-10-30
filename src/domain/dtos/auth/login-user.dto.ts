import { regularExps } from "../../../config";


export class LoginUserDto {

    private constructor(
        public readonly email:string,
        public readonly password: string,
    ){}

    static login(object: {[key:string]:any}):[string?,LoginUserDto?]{

        const {email,password}= object;

        if (!email) return ['missing email',undefined];
        if (!regularExps.email.test(email)) return ['Email is not valid',undefined];
        if (!password) return ['missing password',undefined];
        return[undefined,new LoginUserDto(email,password)];
    }
}
