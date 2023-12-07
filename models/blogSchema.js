import {Schema, model} from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    body: {
        type: String, 
        required: true,
    },
    coverImg: {
        type: String, 
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
}, {timestamps: true})


const BLOG = model("blog", blogSchema);
export default BLOG;