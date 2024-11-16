
const express = require('express');

const router = express.Router();

module.exports = router;

router.get('/', (req, res) => {
    res.send ('vao api');
})

const mongoose = require('mongoose');

const userModel = require('./userModel');

const COMMON = require('./COMMON');

router.get('/list', async (req, res) => {
    await mongoose.connect(COMMON.uri);

    let users = await userModel.find();

    console.log(users);

    res.send(users);
})