import { Request, Response } from 'express';
import { ProductsServices } from '../services/products.services';
import { CustomError,CreateProductDto, PaginationDto } from '../../domain';







export class PorductsController {

    constructor(
        public readonly productService:ProductsServices
    ){}

    private handleError = (error:unknown, res:Response)=>{ 
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({error: error.message});
        }
        console.log(error);
        res.status(500).json({error:'internal server error'});
    };

    getProducts = (req:Request,res:Response)=>{
        const {limit=1, page=1} = req.query;
        const [error,paginationDto]= PaginationDto.create( +limit, +page);
        if (error) return res.status(401).json(error);

        this.productService.getProducts(paginationDto!)
            .then(productos=>res.status(200).json(productos))
            .catch(error=> this.handleError(error,res));
    }

    createProducts = ( req:Request,res:Response)=>{
        const user = req.body.user;
        const [error,productDto] = CreateProductDto.create(req.body);
        if(error) return res.status(401).json({error});

        this.productService.createProducts(productDto!,user)
            .then(pruducto=>res.status(200).json(pruducto))
            .catch(error=>this.handleError(error,res));
    }
}