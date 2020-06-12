const express = require("express");
const router = express.Router();
const userCtrl = require('../controller/adminControler')




router.post('/addProduct',userCtrl.addProduct)
router.post('/login',userCtrl.login)
router.post('/editProduct/:id',userCtrl.editProduct)
router.get('/getProductByCategory/:category',userCtrl.getProductByCategory)

module.exports = router;