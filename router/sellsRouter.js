const express = require("express");
const router = express.Router();
const userCtrl = require('../controller/sellsControler');

const auth = require('../middleware/auth');



router.post('/addSells',auth,userCtrl.addSells)
router.get('/getsellsByUser',auth,userCtrl.getSellsUsers)
router.get('/getallsells',auth,userCtrl.getAllSells)
router.post('/addachat',auth,userCtrl.addAchat)
router.delete('/deleteAchatbyId/:id',auth,userCtrl.deleteAchatbyId)
router.get('/getAchatByuser',auth,userCtrl.getAchatbbyUser)
router.get('/getNewProducts',userCtrl.getNewProduct)
router.delete('/deleteSellsById/:id',auth,userCtrl.deleteSellsById)
router.delete('/removeAchat',auth,userCtrl.removeAchat)
module.exports = router;