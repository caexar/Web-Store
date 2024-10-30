import { envs } from "../../config";
import { CategoryModel, MongoDataBase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";


(async ()=>{

    MongoDataBase.connect(
        {
            dbName:envs.MONGO_DB_NAME,
            mongoUrl:envs.MONGO_URL
        }
    )
    await main();

    MongoDataBase.disconnect();
})();



const randomBetween0andx=(x:number)=>{
    return Math.floor(Math.random()*x);
};


async function main(){
//! 0 borrar todo
await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany()
]);
console.log('eliminando informacion...');

//* 1 crear usuarios
const users = await  UserModel.insertMany(seedData.users);
console.log('creando usuarios...');
//* 2 crear categorias

const categories = await CategoryModel.insertMany(
    seedData.categories.map(category=>{
        return {
            ...category,
            user:users[randomBetween0andx(seedData.users.length-1)]._id
        }
    })
);

console.log('creando categorias...');

//* 3 crear productos
const products = await ProductModel.insertMany(
    seedData.products.map(product=>{
        return {
            ...product,
            user:users[randomBetween0andx(seedData.users.length-1)]._id,
            category:categories[randomBetween0andx(seedData.users.length-1)]._id
        }
    })
);

console.log('creando productos...');
console.log('Base de datos lista!');




}