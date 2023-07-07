const { allChat, chatById } = require('../Controllers/ChatController');
const { protect } = require('../Middleware/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../Controllers/ChatController');

module.exports = (app) => {
    app.post("/api/chat", [protect], accessChat);
    app.get("/api/chat", [protect], fetchChats);
    app.post("/api/chat/group", [protect], createGroupChat);
    app.put("/api/chat/rename", [protect], renameGroup);
    app.put("/api/chat/groupremove", [protect], removeFromGroup);
    app.put("/api/chat/groupadd", [protect], addToGroup);
}