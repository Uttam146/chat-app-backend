const {registerUser,authUser,allUsers} = require('../Controllers/UserController');
const {protect} = require('../Middleware/authMiddleware');

module.exports = (app)=>{
    app.post('/api/signup',registerUser);
    app.post('/api/login',authUser);
    app.get('/api/user',[protect],allUsers);
    
}