const asynchandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const {generateToken} = require('../utils/GenerateToken');

exports.allUsers = asynchandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  });

exports.registerUser = asynchandler(async(req, res) => {
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    
    const user = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password,10),
    });

    if(user){
        res.status(201).send({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id),
        })
    }
})

exports.authUser = asynchandler(async(req, res) => {
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(user && bcrypt.compareSync(password.toString(), user.password)){
        res.status(201).send({
            id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id),
        })     
    }else{
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});