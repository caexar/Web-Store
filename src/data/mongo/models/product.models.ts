import mongoose, { Schema } from "mongoose";



const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        unique:true,
    },
    avaible:{
        type:Boolean,
        default:false,
    },
    price:{
        type:Number,
        default:0
    },
    description:{
        type:String,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:[true,'user creator is required']
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category',
        required:[true,'category is required']
    }

});

productSchema.set('toJSON',{
    //virtuals:true,
    versionKey:false,
    transform:function(doc, ret, options) {
        delete ret._id;
    },
})

export const ProductModel = mongoose.model('Product',productSchema);
