const mongoose = require('mongoose'); // Erase if already required
const { Schema } = mongoose;

// Declare the Schema of the Mongo model
const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    text:{
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
    parentComment: {
        type: mongoose.Types.ObjectId, //commentID
        required:false,
        default:null,
    },
}, {
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Comment', commentSchema);