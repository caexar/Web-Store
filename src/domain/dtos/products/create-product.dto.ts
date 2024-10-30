import { Validator } from "../../../config";

export class CreateProductDto {

    private constructor(
        public readonly name:string,
        public readonly available:boolean,
        public readonly price: number,
        public readonly description:string,
        public readonly user:string, //ID
        public readonly category:string//ID
    ){}

    static create( object: {[key:string]:any}) : [string?,CreateProductDto?] {

        const {name,available,price, description,user,category}=object;

        if (!name) return ['name is required',undefined];
        if (!user) return ['user is required',undefined];
        if (!Validator.isMongoId(user)) return ['is not mongo id',undefined];
        if (!category) return ['category is required',undefined]; 
        if(!Validator.isMongoId(category)) return ['is not mongo id'];
        if (!isNaN(price)) return ['price be must a number',undefined]; 



        return [
            undefined,
            new CreateProductDto(
                name,
                !!available,
                price,
                description,
                user,
                category)];
    }
}