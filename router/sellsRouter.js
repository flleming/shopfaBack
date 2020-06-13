const express = require("express");
const router = express.Router();
const userCtrl = require('../controller/sellsControler');

const auth = require('../middleware/auth');



router.post('/addSells',auth,userCtrl.addSells)
router.get('/getsellsByUser',auth,userCtrl.getSellsUsers)
router.get('/getallsells',auth,userCtrl.getAllSells)
router.post('/addachat',userCtrl.addAchat)
module.exports = router;