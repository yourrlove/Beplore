const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || `mongodb+srv://nanhvt2708:beplo123@hospital.dru8iln.mongodb.net/?retryWrites=true&w=majority&appName=BEPLORE`;

mongoose.connect(mongoURI, {
//   replicaSet: 'mongoRepSet'
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

module.exports = mongoose;
