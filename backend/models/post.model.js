const mongoose = require('mongoose'); // Erase if already required
const { Schema } = mongoose;

// Declare the Schema of the Mongo model
const postSchema = new Schema({
    content:{
        type:String,
        MaxLength: 500
    },
    image:{
        type:String,
        default:null,
    },
    likes: [{
        type: Schema.Types.ObjectId, //userID
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId, //commentID
        ref: 'Comment',
    }],
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps:true,
});

postSchema.index({content: 'text'});


//Export the model
module.exports = mongoose.model('Post', postSchema);