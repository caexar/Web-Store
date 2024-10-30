import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from '../../data/mongo/models/user.models';
import { UserEntity } from "../../domain";







export class AuthMiddlewares{


    static async validatejwt(req:Request,res:Response,next:NextFunction){

        const authorization= req.header('Authorization');
        if (!authorization) res.status(401).json({error:'no token provided'});
        if (!authorization?.startsWith('Bearer')) return res.status(401).json({error:'invalid beare token'});

        //*vidivimos el token por sus espacios
        //*tomamos la posicion 2 del arreglo
        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JwtAdapter.validateToken<{id:string}>(token);
            if(!payload) return res.status(401).json({error:'invalid token'});
            
            const user = await UserModel.findById(payload.id);
            if (!user) return res.status(500).json({error:'internal server error/invalid token'});

            // TODO: VALIDAR SI EL USER ESTA ACTIVO

            req.body.user= UserEntity.fromObject(user);
            
            next();

        } catch (error) {
            console.log(error);
            res.status(500).json({error:'internal server error'});
        }
    }


}