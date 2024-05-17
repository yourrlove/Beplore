const mongoose = require('mongoose'); // Erase if already required
const { Schema } = mongoose;

// Declare the Schema of the Mongo model
const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    profile:{
        name:{
            type:String,
            required:false,
            default:null,
        },
        avatar:{
            type:String,
            required:false,
            default:null,
        },
        bio:{
            type:String,
            required:false, 
            default:null,
        },
        link:{
            type:String,
            required:false,
            default:null,
        },
        followers: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required:false,
        }],
        following: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required:false,
        }]
    },
});


userSchema.index({ userName: 'text', email: 'text', 'profile.name': 'text', 'profile.bio': 'text'});


//Export the model
module.exports = mongoose.model('User', userSchema);