import mongoose, { Schema } from "mongoose";



const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        unique:true
    },
    available:{
        type:Boolean,
        default:false,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:[true,'user creator is required']
    },

});
categorySchema.set('toJSON',{
    //virtuals:true,
    versionKey:false,
    transform:function(doc, ret, options) {
        delete ret._id;
    },
})

export const CategoryModel = mongoose.model('Category',categorySchema);
