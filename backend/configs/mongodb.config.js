const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI_REPLICATION || `mongodb://192.168.1.8:27018,192.168.1.8:27019,192.168.1.8:27020/BEPLORE`;

mongoose.connect(mongoURI, {
//   replicaSet: 'mongoRepSet'
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

module.exports = mongoose;
