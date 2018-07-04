const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports ={
  createId:(req,res)=>{
    if(req.body.password.length > 4){
      var hash = bcrypt.hashSync(req.body.password, 10);
      var newUser = new User({
      name:req.body.name,
      email:req.body.email,
      password: hash
    });
    newUser.save()
      .then(dataUser=>{
        //karena create jadi 201
        res.status(201).json({
          message: 'berhasil add',
          dataUser
        });
      })
      .catch((err) => {
        res.status(500).json({
          message:'gagal create ada yang salah'
        });
      });
    }else{
      res.status(400).json({
        message :'gagal create ada yang salah'
      });
    }
  },

  findSatuan:(req,res)=>{
    console.log('masuk sini', req.body);
    User.findOne({_id:req.body.id})
    .populate('todo')
      .then(dataSatuan=>{
        res.status(200).json({
          message:'sukses kirim data',
          dataSatuan
        });
      })
    .catch((err) => {
      res.status(400).json({
        message:'data tidak ada'
      });
    });
  },

  signin:(req,res)=>{
    User.findOne({email:req.body.email})
    .then(dataUserLogin=>{
      var cekPassword = bcrypt.compareSync(req.body.password, dataUserLogin.password);
      if(cekPassword===true){
        var token = jwt.sign({id:dataUserLogin.id,name:dataUserLogin.name,email:dataUserLogin.email},'secret');
        res.status(200).json({
          message:'sukses login',
          token
        });
      }else{
        res.status(400).json({
          message:'wrong password'
        });
      }
    });
  },

  sosmed:(req,res)=>{
    console.log(req.body);
    User.findOne({email:req.body.email})
    .then((dataUserLogin) => {
      var token = jwt.sign({id:dataUserLogin.id,name:dataUserLogin.name,email:dataUserLogin.email},'secret')
      res.status(200).json({
        message:'sukses login',
        token
      })
    })
    .catch((err) => {
      var newUser = new User({
      name:req.body.name,
      email:req.body.email,
      password: 'password'
    });
    newUser.save()
      .then((dataUserLogin) => {
        var token = jwt.sign({id:dataUserLogin.id,name:dataUserLogin.name,email:dataUserLogin.email},'secret')
        res.status(200).json({
          message:'sukses login',
          token
        })
      })
      .catch((err) => {
        console.log(err);
      });
    })
  }
};
