require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const app = express();
const port = 3000;

const authRoutes = require('./core/auth');
const usersRoutes = require('./core/users');
const donateRoutes = require('./core/donate');

const server = http.createServer(app);
const io = socketIo(server);
app.set('io', io);

// this is middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use(express.json());

// routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/donate', donateRoutes);

// config 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.status(200).send('is running รันแล้วไอ้ควาย');
});

server.listen(port, () => {
    console.log("✅ Server is running on port " + port);
});
