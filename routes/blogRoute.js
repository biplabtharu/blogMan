import {Router} from "express";
import BLOG from "../models/blogSchema.js";
import multer from "multer";
import path from "path";
import COMMENT from "../models/commentSchema.js";

const router = Router();


router.get('/add-blog', (req,res)=>{
    res.render('addBlog', {
        user:req.user
    })
})


router.get('/:id', async (req,res)=>{
    const id = req.params.id;
    const blog = await BLOG.findById(id).populate('createdBy');
    console.log(blog)
    const comments = await COMMENT.find({blogId: req.params.id}).populate('createdBy');
    // console.log(comments);
    res.render('blog', {
        user: req.user,
        blog: blog,
        comments: comments

    })
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${path.resolve('./public/uploads/')}`)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname )
    }
  })
  
  const upload = multer({ storage: storage })

router.post('/add-blog',upload.single('coverImg'), async (req,res)=>{
    const {title, body} = req.body;
    try{    
        const blog = new BLOG({
            title: title,
            body: body,
            createdBy: req.user.id,
            coverImg: `/uploads/${req.file.filename}`
        })

        const newBlog = await blog.save();
        res.redirect(`/blog/${newBlog._id}`)
        // console.log(newBlog)
    }catch(err){
        console.log(`adding blog error ${err}`);
    }
})


router.get("/delete-all-blogs", async (req,res)=>{
    await BLOG.deleteMany();
    res.render('addBlog');
    console.log(`deleted all the blogs successfully`);
})



// --------------------COMMENT SECTION---------------
router.post('/comment/:blogId', async (req,res)=>{
    const {comment} = req.body;


    const newComment = await COMMENT.create({
        comment,
        blogId: req.params.blogId,
        createdBy: req.user.id
    })

    res.redirect(`/blog/${req.params.blogId}`)
    console.log(`commented successfully`);
})


export  {router};
