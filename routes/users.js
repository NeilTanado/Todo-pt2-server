var express = require('express');
var router = express.Router();
const Controller = require('../controller/createUser');

router.get('/',(req,res)=>{
  res.send('halo');
});

router.post('/createuser', Controller.createId);
router.post('/finduser',Controller.findSatuan);
router.post('/signin',Controller.signin);
router.post('/sosmed',Controller.sosmed);

module.exports = router;
