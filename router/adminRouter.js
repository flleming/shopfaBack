const express = require("express");
const router = express.Router();
const userCtrl = require('../controller/adminControler')
const auth = require('../middleware/auth');



router.post('/addProduct',auth,userCtrl.addProduct)
router.post('/login',userCtrl.login)
router.post('/editProduct/:id',auth,userCtrl.editProduct)

router.delete('/deleteProduct/:id',auth,userCtrl.deleteProductbyId)

router.get('/getallProduct',auth,userCtrl.getAllProduct)
router.get('/getAllUser',userCtrl.getallUsers)
router.delete('/deleteUserById/:id',auth,userCtrl.deleteUserById)

module.exports = router;