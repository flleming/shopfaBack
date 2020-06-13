const express = require("express");
const router = express.Router();
const userCtrl = require('../controller/userControler')




router.post('/login', userCtrl.login);
router.post('/signup',userCtrl.signup)
router.get('/getProductByCategory',userCtrl.getProductByCategory)


module.exports = router;