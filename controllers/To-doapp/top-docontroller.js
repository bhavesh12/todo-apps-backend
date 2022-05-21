const { response }   = require('express');
const jwt            = require("jsonwebtoken");
const { ObjectId }   = require('bson');
var ToDoModal        = require('../../model/To-doapp/ToDoapp');

exports.addTodoapp  = async (req, res) => {
    try
    { 
        let postData = req.body;
        const applins = new ToDoModal({
            name : postData.name,
            status : postData.status,
            description : postData.description,
            creatBy : postData.creatBy,
            assignUser: postData.assignUser,
        })
        const appData = await applins.save();   
        outputJson = {code: 200, status: "Success",message: 'Add App Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'Invaild Payload'};
        res.json(outputJson);
    }
};

exports.getTodoapp  = async (req, res) => {
    try
    {
        let postData = req.body;
        let where = {};
        where["isDeleted"] = false;
        let AllAppaggregate = [
            {  
                $match:where
            },
            { 
                $lookup:{
                        from: 'users',
                        localField: 'creatBy',
                        foreignField: '_id',
                        as: 'authorsdata'
                }
            },
            { 
                $lookup:{
                        from: 'users',
                        localField: 'assignUser',
                        foreignField: '_id',
                        as: 'assigndata'
                }
            },
            { $sort: { _id: -1 } },
            {   
                $project: { 
                _id:1,
                name:1,
                status: 1,
                description:1,
                creatBy: "$authorsdata",
                assigndata:"$assigndata"
                } 
            },  
        ];
        var all_app = await ToDoModal.aggregate(
            AllAppaggregate
        );
    
        outputJson   = {
                         code: 200, 
                         status: "Success",
                         message: 'View All App Successfully',
                         result: all_app,
                        };
        res.json(outputJson);
    }
    catch(error)
    { 
        outputJson   = {code: 400, status: "Faild",message: 'Invaild Payload'};
        res.json(outputJson);
    }
};

exports.editappdata = async (req, res) => {
    try 
    {
        let postData = req.body;
        let where    = {_id:req.query.id}
        let getApp   = await ToDoModal.findOne(where); 

        let obj = {
            name : postData.name,
            status : postData.status,
            description : postData.description,
            assignUser : postData.assignUser,
        }

        let result = await ToDoModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update App successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        outputJson   = {code: 400, status: "Faild",message: 'Invaild Payload'};
        res.json(outputJson);
    }
};

exports.removeAppdata  = async (req, res) => {
    try {
        let postData = req.params.app_id;
        let where    = {_id:ObjectId(postData)};
        let getApp   = await ToDoModal.findOne(where); 

        if(!getApp)
        {
            outputJson   = {code: 400, status: "Faild",message: 'Invaild Payload'};
            return res.json(outputJson); 
        }

        if(getApp.creatBy != req.loginuser._id && req.loginuser.role != 'admin')
        {
            outputJson   = {code: 400, status: "Faild",message: 'Invaild Payload'};
            return res.json(outputJson);
        }
        
		let remove_app  	= await ToDoModal.deleteOne(where);
		res.status(201).json({
			status: 'success',
			message: 'App Remove successfully.'
		});
    } catch (error) {
	    outputJson   = {code: 400, status: "Faild",message: 'Invaild Payload'};
        res.json(outputJson);
    }              
}

exports.userWiseApp_Fetch  = async (req, res) => {
    try
    {
        let postData = req.body;
        let where = {};
        where["isDeleted"]  = false;
        where["assignUser"] = ObjectId(req.params.id); 
        let AllAppaggregate = [
            {  
                $match:where
            },
            { 
                $lookup:{
                        from: 'users',
                        localField: 'creatBy',
                        foreignField: '_id',
                        as: 'authorsdata'
                }
            },
            { 
                $lookup:{
                        from: 'users',
                        localField: 'assignUser',
                        foreignField: '_id',
                        as: 'assigndata'
                }
            },
            { $sort: { _id: -1 } },
            {   
                $project: { 
                _id:1,
                name:1,
                status: 1,
                description:1,
                creatBy: "$authorsdata",
                assigndata:"$assigndata"
                } 
            },  
        ];
        var all_app = await ToDoModal.aggregate(
            AllAppaggregate
        );
        
        outputJson   = {
                         code: 200, 
                         status: "Success",
                         message: 'View All App Successfully',
                         result: all_app,
                        };
        res.json(outputJson);
    }
    catch(error)
    { 
        outputJson   = {code: 400, status: "Faild",message: 'View All App Faild'};
        res.json(outputJson);
    }
};

exports.getTodoappBystatus  = async (req, res) => {
    try
    { 
        let statusval = req.params.status;
        let where = {};
        where["status"] = statusval;
        
        const data = await ToDoModal.find(where);   
        outputJson = {code: 200, status: "Success",message: 'Todo list', data : data};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'Invaild Payload'};
        res.json(outputJson);
    }
};