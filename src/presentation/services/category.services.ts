import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";
import { UserEntity } from '../../domain/entities/user.entity';



export class CategoryServices{

    constructor(){}


    async createCategory(createCategroyDto:CreateCategoryDto, user: UserEntity){

        const {name,availabe}=createCategroyDto;

        const categoryExist= await CategoryModel.findOne({name:name});

        if (categoryExist) throw CustomError.badRequest('category already exist');

        try {
            const category = await CategoryModel.create({
                ...createCategroyDto,
                user: user.id
            });

            return {
                id:category.id,
                name:category.name,
                availabe: category.available
            };

        } catch (error) {
            throw CustomError.badRequest(`${error}`);
        }
    }

    async getCategory(dtoPagination:PaginationDto){

        const{page,limit}=dtoPagination;

        try {

        //* dos await seguidos, se transforma en un promise all
        const [total,categories] = await Promise.all([
            CategoryModel.countDocuments(),
            CategoryModel.find()
            .skip( (page-1) * limit )
            .limit( limit)
        ])

        if (!categories) throw CustomError.internalServer('not found categories');

        return  {
            page: page,
            limit: limit,
            total:total,
            next: `/api/categories?page=${(page+1)}&limit=${limit}`,
            prev: (page - 1 > 0)? `/api/categories?page=${(page-1)}&limit=${limit}`:null,

            categories: categories.map(categorias=>({
                id: categorias.id,
                name: categorias.name,
                available: categorias.available,
            }))
        }

        } catch (error) {
            throw CustomError.internalServer('internal server error');
        }
        
    }


}