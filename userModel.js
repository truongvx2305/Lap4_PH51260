const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    ma: {
        type: String,
        required: true
    },
    ten: {
        type: String,
        required: true
    },
    tuoi: {
        type: Number
    },
    lop: {
        type: String,
        required: true
    },
    nganh: {
        type: String,
        required: true
    },

});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
