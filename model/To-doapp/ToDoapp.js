const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    status: { type: String, default: ['To-Do'], required: true },  
    description: { type: String, required: true },
    creatBy : {type: mongoose.Schema.Types.ObjectId,required: true},
    assignUser: {type: mongoose.Schema.Types.ObjectId,required: true},
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    isDeleted: { type: Boolean, default: false },  
});

module.exports = mongoose.model("todoapp", dataSchema);