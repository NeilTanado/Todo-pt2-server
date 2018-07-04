const ToDo = require('../models/todo');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const weather = require('weather-js');

module.exports ={

  createToDo:(req,res)=>{
    console.log(req.body,'====>');
    console.log(req.headers);
    var newTodoList = new ToDo({date:req.body.date,description:req.body.description,status:false});
    newTodoList.save()
    .then(dataTodo =>{
      var decoded = jwt.decode(req.headers.tokenuser);
      User.findOneAndUpdate({_id:decoded.id},{
        $push:{todo:mongoose.Types.ObjectId(newTodoList._id)}
      })
      .populate('todo')
      .then(dataUser =>{
        res.status(200).json({
          message: 'data diupdate',
          dataUser
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: 'anda tidak ada authorized'
        });
      });
    });
  },

  readToDo:(req,res)=>{
    var decoded = jwt.decode(req.headers.token);
    User.findById({_id:decoded.id})
    .populate('todo')
    .then(data=>{
      res.status(200).json({
        message: 'data dikirim',
        data
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: 'anda tidak ada authorized'
      });
    });
  },

  updateTodo:(req,res)=>{
    ToDo.findOneAndUpdate({_id:req.params.id},
    {status : req.body.status})
    .then((value) => {
      res.status(200).json({
        message:'update data sukses'
      });
    });
  },

  deleteTodo:(req,res)=>{
    console.log(req.params.id);
    var decoded = jwt.decode(req.headers.token);
    User.find({_id:decoded.id})
    .then(data=>{
      data[0].todo.remove(req.params.id);
      ToDo.findByIdAndRemove(req.params.id,(err,todo)=>{
        res.status(200).json({
          message: 'sukses delete todo'
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
  },

  weather:(req,res)=>{
    weather.find({search: 'Jakarta', degreeType: 'C'}, function(err, result) {
    if(err) console.log(err);
      res.status(200).json({
        result
      });
    });
  }
};
