const { response } = require('express');
const jwt          = require("jsonwebtoken");
var userModel      = require('../../model/users/User');
const { ObjectId } = require('bson');

exports.login = async (req, res) => {
    try
    {
        // Check user Email and password in database

        const user = await userModel.findOne({
            email : req.body.email,
            password: req.body.password
        });

        if(!user)
        {
            outputJson  = {code: 400, status: "faild", message: 'Email is wrong'};
            return res.json(outputJson);
        }
        
        if(req.body.password != user.password)
        {  
            outputJson  = {code: 400, status: "faild", message: 'Invalid Password'};
            return res.json(outputJson);
        }

        // Assign Token 
        const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
        
        // Update Token database
        const updatedata = await userModel.findOneAndUpdate( 
            {_id: user._id}, 
            {
            loginToken: token,
            },
            {new:true}
        );
        
        if(updatedata)
        {
            outputJson  = {user:updatedata,code: 200, status: "Success", message: 'Login Success'};
            res.json(outputJson);
        }
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'Invaild Payload'};
        res.json(outputJson);
    } 
};

exports.registerUser = async (req, res) => {
    try
    {
        const email = req.body.email;
        const password  = req.body.password;

        const userData = await userModel.findOne({
            email : req.body.email,
        });

        if(userData)
        {
            outputJson  = {code: 400, status: "faild", message: 'Email already exists'};
            return res.json(outputJson);
        }

        if(req.body.role != 'user')
        {  
            outputJson  = {code: 400, status: "faild", message: 'Invalid Role'};
            return res.json(outputJson);
        }

        const user = new userModel({
            name: req.body.name,
            lastname: req.body.lastname,
            email : email,
            password : password,
            role: req.body.role,
        }) 
        
        const userdata = await user.save();
        outputJson     = {code: 200, status: "Success", message: 'Register Success'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'Invaild Payload'};
        res.json(outputJson);
    }
};

exports.fetchUserData  = async (req, res) => {
    try
    {
        if(req.loginuser.role != 'admin')
        {
            outputJson   = {code: 400, status: "Faild",message: 'Invaild Payload'};
            return res.json(outputJson);
        }

        let postData = req.body;
        let where = {};
        
        let Alluseraggregate = [
            {  
                $match:{isDeleted : false, role : {$ne : 'admin'}}
            },
            { $sort: { _id: -1 } },
            {   
                $project: { 
                    _id:1,
                    email:1,
                    name: 1,
                    lastname: 1,
                } 
            },  
        ];
        var all_user = await userModel.aggregate(
            Alluseraggregate
        );

        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View User Successfully',
            result:all_user,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View User Faild'};
        res.json(outputJson);
    }
};

exports.removeUserdata  = async (req, res) => {
    try {
        let postData = req.params.user_id;
        if(req.loginuser.role != 'admin')
        {
            outputJson   = {code: 400, status: "Faild",message: 'Invaild Payload'};
            return res.json(outputJson);
        }

        let where    = {_id:ObjectId(postData)};
		let remove_app  	= await userModel.deleteOne(where);
		res.status(201).json({
			status: 'success',
			message: 'User Remove successfully.'
		});
    } catch (error) {
	    outputJson   = {code: 400, status: "Faild",message: 'Invaild Payload'};
        res.json(outputJson);
    }              
}

