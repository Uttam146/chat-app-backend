const asyncHandler = require("express-async-handler");
const Chat = require("../Models/Chat");
const User = require("../Models/User");
const Message = require("../Models/Message");

const sendMessage = asyncHandler(async (req, res) => {
    const {content,chatId} = req.body;
    if(!content || !chatId){
        console.log("No Content and chatId is passed");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatId,
    }

    try{
        var message = await Message.create(newMessage);
        message = await message.populate("sender","name pic");
        message = await message.populate("chat");
        message = await User.populate(message,{
            path:'chat.users',
            select:"name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message,
        });
        res.json(message);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
        throw new Error(err.message);

    }

});

const allMessages = asyncHandler(async(req,res)=>{
    try{
        const messages = await Message.find({chat:req.params.chatid}).populate(
            "sender",
            "name pic email"
        ).populate("chat");
        res.status(200).json(messages);
    }catch(err){
            res.status(500);
            throw new Error(err.message);
    }
});
module.exports = {
    sendMessage,
    allMessages

}