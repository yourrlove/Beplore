const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
require('dotenv').config();

const mongoose = require('./configs/mongodb.config')

const userRouter = require('./routes/user.route');
const postRouter = require('./routes/post.route');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
