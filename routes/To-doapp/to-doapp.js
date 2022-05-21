const express     = require('express')
const router      = express.Router()
const auth        = require("../../middleware/auth");
const customerObj = require('../../controllers/To-doapp/top-docontroller');

// Blog Api
router.post('/add',auth,customerObj.addTodoapp);
router.get('/fetchdata',auth,customerObj.getTodoapp);
router.put('/edit',auth,customerObj.editappdata);
router.get('/userwiseapp/:id',auth,customerObj.userWiseApp_Fetch);
router.delete('/remove/:app_id',auth,customerObj.removeAppdata);
router.get('/getTodoapp/:status',auth,customerObj.getTodoappBystatus);

module.exports = router; 