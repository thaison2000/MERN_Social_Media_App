const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const dotenv = require('dotenv')
const cors = require('cors')

const app = express();
app.use(cors())

const {
  USER_API_URL,
  POST_API_URL,
  CHAT_API_URL,
  SOCKET_API_URL,
} = require('./URLs');

const optionUser = {
  target: USER_API_URL,
  changeOrigin: true, 
  logger: console,
  secure: false,
  
};

const optionPost = {
  target: POST_API_URL,
  changeOrigin: true, 
  logger: console,
  secure: false
};

const optionChat = {
    target: CHAT_API_URL,
    changeOrigin: true, 
    logger: console,
    secure: false
  };

const optionSocket = {
    target: SOCKET_API_URL,
    changeOrigin: true, 
    logger: console,
    secure: false
  };

const userProxy = createProxyMiddleware(optionUser);
const postProxy = createProxyMiddleware(optionPost);
const chatProxy = createProxyMiddleware(optionChat);
const socketProxy = createProxyMiddleware(optionSocket);


app.get('/', (req, res) => res.send('Hello Gateway API'));


app.use('/api/auth', userProxy);
app.use('/api/user', userProxy);
app.use('/api/friendRequest', userProxy);

app.use('/api/post', postProxy);
app.use('/api/comment', postProxy);

app.use('/api/message', chatProxy);
app.use('/api/conversation', chatProxy);

app.use('/user/images', userProxy);
app.use('/post/images', postProxy);

app.use('/', socketProxy);


app.listen(3300, () => console.log(`API GATEWAY running !`));