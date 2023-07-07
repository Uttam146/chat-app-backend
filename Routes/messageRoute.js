const {sendMessage,allMessages } = require('../Controllers/MessageController');
const { protect } = require('../Middleware/authMiddleware');

module.exports = (app) => {

    app.post('/api/message',[protect],sendMessage);
    app.get('/api/message/:chatid',[protect],allMessages);

}