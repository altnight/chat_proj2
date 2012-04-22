
/*
 * GET home page.
 */
//Schema

var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/chat');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var User = new Schema({
  name : {type: String, required: true},
  password: {type: String, required: true}
});
mongoose.model('User', User);
var UserModel = mongoose.model('User');

var Room = new Schema({
  name : {type: String, required: true},
  date : {type: Date, default: Date.now}
});
mongoose.model('Room', Room);
var RoomModel = mongoose.model('Room');

var Chat = new Schema({
  date : {type: Date, default: Date.now},
  name : {type: String, required: true},
  chat: {type: String, required: true},
  room : {type: String, required: true}
});
mongoose.model('Chat', Chat);
var ChatModel = mongoose.model('Chat');
//Schema

exports.index = function(req, res){
  if (req.session.name){
    res.render('index', { title: "Welcome My Chat by " + req.session.name });
  }
  else {
    res.render('index', { title: "Welcome My Chat by 増田"});
  }
};

exports.signup = function(req, res){
  res.render('signup', { title: 'signup' });
};

exports.create_signup = function(req, res){
  //if (! /[0-9a-zA-Z\-_]+/.test(req.body.name)){
    //res.send('name は 半角英数で');
    //res.redirect('/signup');
  //}
  //if (req.body.name.length < 8){
    //res.send('name は 8文字以上にしましょう');
    //res.redirect('/signup');
  //}
  //if (! /[0-9a-zA-Z\-_]+/.test(req.body.password)){
    //res.send('password は 半角英数で');
    //res.redirect('/signup');
  //}
  //if (req.body.password.length < 8){
    //res.send('password は 8文字以上にしましょう');
    //res.redirect('/signup');
  //}
  //if (req.body.password != req.body.password2) {
    //res.send('パスワード確認が間違ってるよ');
    //res.redirect('/signup');
  //}

  UserModel.findOne({name:req.body.name}, function(err, obj){
    if (obj){
      console.log('同じ名前の人がいます');
      res.redirect('/signup');
    }
    else {
      console.log('新規登録します');
      var user = new UserModel();
      user.name = req.body.name;
      user.password = req.body.password;
      user.save();
      req.session.name = user.name;
      res.redirect('/');
    }
  });
  //一覧
  //UserModel.find({}, function(err, docs){
    //docs.forEach(function(doc){
      //console.log(doc);
    //});
  //});
};

exports.login = function(req, res){
  res.render('login', { title: 'login' });
};

exports.create_login = function(req, res){
  UserModel.findOne({name:req.body.name, password:req.body.password}, function(err, obj){
    if (obj){
      console.log('ログインします');
      req.session.name = req.body.name;
      res.redirect('/');
    }
    else {
      console.log('ログイン失敗');
      res.redirect('/login');
    }
  });
};

exports.logout = function(req, res){
  delete req.session.name;
  delete req.session.room;
  res.redirect('/');
};

exports.roby = function(req, res){
  RoomModel.find({}, function(err, room){
      res.render('roby', {title: 'roby',
                          room: room});
  });
};

exports.create_roby = function(req, res){
  if (req.body.room === "") return false;
  console.log('新規room登録します');
  var room = new RoomModel();
  room.name = req.body.room;
  room.save();
  req.session.room = req.body.room;
  res.redirect('/roby');
};

exports.room = function(req, res){
  req.session.room = req.params.id;
  ChatModel.find({room: req.session.room}, function(err, chat){
      res.render('room', {title: 'room:' + req.session.room,
                          chat: chat});
  });
};

exports.create_room = function(req, res){
  var chat = new ChatModel();
  chat.chat = req.body.chat;
  req.session.name === undefined ? name = 'anony' : name = req.session.name;
  chat.name = name;
  chat.room = req.session.room;
  chat.save();
  res.redirect('/room/' + req.session.room);
};
