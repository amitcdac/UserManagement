const express = require('express')
const user_Route =  express();

user_Route.set('view engine','ejs');
user_Route.set('views', './views/users');

const bodyParser = require('body-parser');
user_Route.use(bodyParser.json());
user_Route.use(bodyParser.urlencoded({extended:true}))


const multer = require("multer");
const path = require('path')
const storage = multer.diskStorage({
    destination:function(req,res,cb){
       cb(null,path.join(__dirname,'../public/userImages'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})

const upload = multer({storage:storage})

const userContrller = require('../controllers/userController')
user_Route.get('/register',userContrller.loadRegister)

user_Route.post('/register',upload.single('image'),userContrller.insertUser);

user_Route.get('/verify',userContrller.verifyMail)

user_Route.get('/',userContrller.loginLoad)
user_Route.get('/login',userContrller.loginLoad)


module.exports = user_Route