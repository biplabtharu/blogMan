import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import router from "./routes/userRoute.js";
const port = process.env.PORT || 8000;
import cookieParser from "cookie-parser";
import { checkForAuthenticationCookie } from "./middleware/authentication.js";
import {router as blogRouter} from "./routes/blogRoute.js";
import BLOG from "./models/blogSchema.js";

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(`${path.resolve('./public')}`))

app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use("/user", router);
app.use("/blog", blogRouter);

app.get('/', async (req,res)=>{
    const allBlogs = await BLOG.find();

    res.render('homepage', {
        user: req.user,
        blogs: allBlogs
    });
})

app.listen(port, ()=>{
    mongoose.connect(process.env.MONGODB_URI).then(console.log(`mongodb connected successfully`)).catch((err)=>console.log(`database connection error ${err}`));
    console.log(`server started at PORT -> ${port}`);
})    // console.log(req.user)
