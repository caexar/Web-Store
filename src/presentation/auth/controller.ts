import { Request, Response, } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.services";
import { UpdateUserDto } from "../../domain/dtos/auth/update-user.dto";




export class AuthController{
    constructor(
        public readonly authService:AuthService,
    ){}

    private handleError = (error:unknown, res:Response)=>{ 
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({error: error.message});
        }
        console.log(error);
        res.status(500).json({error:'internal server error'});
    };


    register = (req:Request, res:Response)=>{

        const [error,registerDto]=RegisterUserDto.create(req.body);
        if (error) {
            return res.status(400).json({error});
        }


        this.authService.registerUser(registerDto!)
            .then(user=> res.json(user))
            .catch(error=> this.handleError(error,res));
    };

    loginUser = (req:Request, res:Response)=>{
        const [error,loginUserDto]= LoginUserDto.login(req.body);
        if (error) return res.status(400).json(error); 

        this.authService.loginUser(loginUserDto!)
            .then(user=>res.status(200).json(user))
            .catch(error=> this.handleError(error,res));
    };


    validate = (req:Request, res:Response)=>{
        const {token} = req.params;
        
        this.authService.validateEmail(token)
            .then(()=>res.json('EMAIL WAS VALIDATED PROPERLY!'))
            .catch(error=> this.handleError(error,res));
    };

    deleteUser = (req:Request,res:Response)=>{
        const {id}=req.params;
        this.authService.deleteUser(id)
            .then(userDelete=>res.status(200).json(userDelete))
            .catch(error=> this.handleError(error,res));
    }


    updateUser = (req:Request,res:Response)=>{
        const {id}= req.params;
        if (!id) return res.status(400).json('no id params');
        const [error,updateDto]= UpdateUserDto.create(req.body);
        if (error) return res.status(401).json({error:error});

        this.authService.updateUser(id,updateDto!)
            .then(update=>res.status(200).json(update))
            .catch(error=>this.handleError(error,res));

    }


}