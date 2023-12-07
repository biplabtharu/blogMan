import { Router } from "express";
import USER from "../models/userSchema.js";
import { createHmac } from "node:crypto";
import multer from "multer";
import path from "node:path";

const router = Router();

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/signin", (req, res) => {
  res.render("signin");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${path.resolve('./public/images/')}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/signup", upload.single('profileImg'), async (req, res) => {
  const { fullname, email, password } = req.body;

  try {

    const isUser = await USER.findOne({ email: email });
    console.log(req.file);
    console.log(req.body)
    if (isUser) return res.json(`user already present`);
    const user = new USER({
      fullname: fullname,
      email: email,
      password: password,
      profileImg: `/images/${req.file.filename}`
    })

      await user.save();
      res.redirect("/");
    } catch (err) {
      console.log(`signup error ${err}`);
    }
  });


router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const isUser = await USER.findOne({ email: email });
    const user = await isUser.matchPassword(email, password);
    if(user){
      return res.cookie('token', user).redirect('/');
    }
    else{
      res.render('signin', {
        error: "incorrect email or password"
      })
    }
  } catch (error) {
    res.render('signin', {
      error: "incorrect email or password"
    })
  }
});


router.get("/logout", async(req,res)=>{
  return res.clearCookie("token").redirect('/')
});

export default router;
