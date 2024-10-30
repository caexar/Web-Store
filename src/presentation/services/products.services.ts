import { CreateProductDto } from "../../domain/dtos/products/create-product.dto";
import { CategoryModel, ProductModel } from "../../data";
import { CustomError, PaginationDto, UserEntity } from "../../domain";




export  class ProductsServices{

    constructor(){}


    async getProducts(paginationDto:PaginationDto){
        const {limit,page}= paginationDto;

        try {
            const [total,products] = await Promise.all([
                ProductModel.countDocuments(), //*
                ProductModel.find()
                    .skip((page-1)* limit)
                    .limit(limit)
                    .populate('user')
                    .populate('category')

            ]);

            return {
                page:page,
                limit:limit,
                total:total,
                next:`/api/products?page=${(page+1)}&limit=${limit}`,
                prev:(page - 1 > 0) ? `/api/products?page=${(page-1)}&limit=${limit}`:null,
                
                products: products,
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }

    }
    async createProducts(productDto:CreateProductDto, user: UserEntity){

        const [ existProduct,existCategory] = await Promise.all([
            ProductModel.findOne({name:productDto.name}),
            CategoryModel.findOne({_id:productDto.category})
        ]);

        if(existProduct) throw CustomError.badRequest('product already exist');
        if(!existCategory) throw CustomError.badRequest('Category not found');

        try {
            const newProduct = await ProductModel.create({...productDto,user:user.id});
            return newProduct;

        } catch (error) {
            throw CustomError.internalServer(`error al crear: ${error}`);
        }

    }

}