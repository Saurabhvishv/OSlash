const Express = require('express');

const router = Express.Router();

const userController=require("./controller/userController")
const urlController= require("./controller/urlController")
const Middleware = require("./middleware/Authentication")

//USER API
router.post('/User',userController.registerUser)
router.post('/Login',userController.login)
//router.get('/User/:userId/profile',Middleware.Auth,usercontroller.GetUsers)
// router.put('/User/:userId/profile',Middleware.Auth,usercontroller.updateUser)

router.post('/url/shorten', urlController.genrateShortUrl);
module.exports = router;