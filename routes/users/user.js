const express = require('express')
const router  = express.Router()

const auth    = require("../../middleware/auth");
const customerObj = require('../../controllers/users/user-controller');

// Register User

router.post('/login', customerObj.login);
router.post('/registerUser', customerObj.registerUser);

// Fetch User Details
router.get('/fetchUserData',auth,customerObj.fetchUserData);
router.delete('/remove/:user_id',auth,customerObj.removeUserdata);

module.exports = router;