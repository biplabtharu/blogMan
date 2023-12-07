import {Schema, model} from "mongoose";

const commentSchema = new Schema({
    comment: {
        type: String
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blog"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
    }
})

const COMMENT = model("comment", commentSchema);
export default COMMENT;