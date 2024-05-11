const mongoose = require('mongoose'); // Erase if already required
const { Schema } = mongoose;

// Declare the Schema of the Mongo model
const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content:{
        type:String,
        MaxLength: 500
    },
    image:{
        type:String,
        default:null,
    },
    likes:[{
        type: Schema.Types.ObjectId, //userID
        ref: 'User',
    }],
    replies:[{
        type: Schema.Types.ObjectId, //commentID
        ref: 'Comment',
    }],
    parentComment: {
        type:String,
        required:false,
    }
}, {
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Comment', commentSchema);