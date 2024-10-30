import { Request, Response, } from "express";
import { CreateCategoryDto, CustomError, PaginationDto} from "../../domain";
import { CategoryServices } from "../services";






export class CategoryController{
    constructor(
        public readonly categoryService:CategoryServices,
    ){}

    private handleError = (error:unknown, res:Response)=>{ 
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({error: error.message});
        }
        console.log(error);
        res.status(500).json({error:'internal server error'});
    };

    createCategory = (req:Request, res:Response)=>{
        const [error,createDto]= CreateCategoryDto.create(req.body);
        if(error) res.status(400).json(error);

        this.categoryService.createCategory(createDto!,req.body.user)
            .then(category => res.status(201).json(category))
            .catch(error=> this.handleError(error,res));
    };

    getCategories = async (req:Request, res:Response)=>{

        const {page=1,limit=10}= req.query;
        //!el req.query son strings!
        //?por eso se pone un + para cambiarlo a nummero
        const [error,paginationDto]= PaginationDto.create( +page, +limit );
        if (error) res.status(400).json(error);

            
        this.categoryService.getCategory(paginationDto!)
            .then(category => res.status(200).json(category))
            .catch(error=> this.handleError(error,res));
    };







};