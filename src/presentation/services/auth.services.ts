import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { UserModel } from '../../data/mongo/models/user.models';
import { bcryptAdapter, envs, JwtAdapter, Validator } from "../../config";
import { EmailService } from "./email.services";
import { UpdateUserDto } from "../../domain/dtos/auth/update-user.dto";





export class AuthService{

    constructor(
        private readonly emailService:EmailService,
    ){}


    public async registerUser(registerDto:RegisterUserDto){

        const existUser= await UserModel.findOne({email: registerDto.email});
        if (existUser) throw CustomError.badRequest('email already exist!');

        //*try para hacer grabaciones en bases de datos- recomendacion
        try {
            //*forma 1
           //const usuario = await UserModel.create(registerDto);


            const user = new UserModel(registerDto);
           
            //*escriptar password
            user.password = bcryptAdapter.hash(registerDto.password);
            
            await user.save();

            //?jwt para autenticacion
            const token = await JwtAdapter.generateToken({id:user.id});
            if (!token) throw CustomError.internalServer('error while genereting token');


            //?email de confirmacion
            await this.senEmailValidationLink(user.email);




            const {password,...userEntity}= UserEntity.fromObject(user);


            return {
                user: userEntity,
                token: token,
            };
        
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };


    public async loginUser(loginDto:LoginUserDto){

        const user = await UserModel.findOne({email: loginDto.email});
        if (!user) throw CustomError.badRequest('email/user not found');

        const isMatch = bcryptAdapter.compare(loginDto.password,user.password);
        if (!isMatch) throw CustomError.badRequest('incorrect password');

        const {password,...informacionUser}=UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToken({id:user.id, email:user.email});

        if(!token) throw CustomError.internalServer('error while creating JWT');


        return {
            user: informacionUser,
            token:token,
        }
    };

    private senEmailValidationLink = async (email:string)=>{
        const token = await JwtAdapter.generateToken({email});
        if(!token) throw CustomError.internalServer('error getting token');

        const link= `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
            <h1>VALIDATE YOUR EMAIL </H1>
            <p> Click on the following link to validate your email </p>
            <a href="${link}" >Validate your email: ${email}</a>
        `;

        const options ={
            to: email,
            subject:'validate your email',
            htmlBody:html
        };

        const isSent = await this.emailService.sendEmail(options);
        if (!isSent) throw CustomError.internalServer('error sending email');
        return true;
    };


    public async validateEmail (token:string){

        const payload = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.unAuthorized('invalid token');
        
        const {email} = payload as {email:string};
        if (!email) throw CustomError.internalServer('email not in token');

        const user = await UserModel.findOne({email});
        if (!user) throw CustomError.internalServer('email not exist');

        //* cambiar el estado en db 
        user.emailValidated=true;
        await user.save();
        return true;
    };

    public async deleteUser(id:string){
        const validId= Validator.isMongoId(id);
        if (!validId) throw CustomError.badRequest('innvalid id, is not mongo id');

        const exist = await  UserModel.findOne({_id:id});
        if (!exist) throw CustomError.badRequest('user not exist!');
        
        try {        
            await UserModel.deleteOne({_id:id});
            return  UserEntity.fromObject(exist);
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };


    public async updateUser(id:string,updateDto:UpdateUserDto){
       
        const isExist= await UserModel.findById(id);
        if (!isExist) throw CustomError.badRequest('user not found');
 
        try {
            let updateUserPass:any = {...updateDto};

            if (updateDto.password) {
                updateUserPass.password = bcryptAdapter.hash(updateDto.password);
            }
            
            await UserModel.updateOne(
                {_id:id},updateUserPass
            );
        
            const update= await UserModel.findById(id);
            if (!update) throw CustomError.badRequest('user not update');

            return UserEntity.fromObject(update);
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

}

