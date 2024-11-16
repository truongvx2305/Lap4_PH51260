const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const userModel = require('./userModel');
const apiMobile = require('./api');
const COMMON = require('./COMMON');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiMobile);

const uri = COMMON.uri;

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});

mongoose.connect(uri).catch(error => console.log("Connection Error: ", error));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname.split('.');
        let newFileName = fileName.slice(0, -1).join('.') + '-' + Date.now() + '.' + fileName[fileName.length - 1];
        cb(null, newFileName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Chỉ cho phép file ảnh!'), false);
        }
        cb(null, true);
    }
});

app.get('/', async (req, res) => {
    let users = await userModel.find();
    res.send(users);
});

app.post('/add_user', async (req, res) => {
    let use = req.body;
    let kq = await userModel.create(use);
    let users = await userModel.find();
    res.send(users);
});

app.delete('/xoa/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userModel.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            return res.json({
                "status": 200,
                "messenger": "Xóa thành công",
                "data": result
            });
        } else {
            return res.json({
                "status": 400,
                "messenger": "Lỗi, Xóa không thành công",
                "data": []
            });
        }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "messenger": "Lỗi xóa người dùng: " + error.message,
            "data": []
        });
    }
});

app.put('/update/:ten', async (req, res) => {
    try {
        let tenUser = req.params.ten;
        let tenUserMoi = tenUser + ' Haha';
        const result = await userModel.updateOne({ ten: tenUser }, { ten: tenUserMoi });
        if (result.matchedCount === 0) {
            return res.status(404).send('Không tìm thấy người dùng để cập nhật');
        }
        let users = await userModel.find();
        res.send(users);
    } catch (error) {
        res.status(500).send('Lỗi cập nhật người dùng: ' + error.message);
    }
});

app.post('/uploadfile', upload.single('myfile'), (req, res, next) => {
    let file = req.file;
    if (!file) {
        var error = new Error('Chưa chọn file!');
        error.httpStatusCode = 400;
        return next(error);
    }

    let pathFileInServer = file.path;
    res.json({
        status: 'success',
        file: {
            path: pathFileInServer,
            url: `http://localhost:3000/${pathFileInServer}`
        }
    });
});




// app.get('/add_user', async (req, res) => {
//     await mongoose.connect(uri);

//     let use = {
//         "ma": "PH49065",
//         "ten": "Minh",
//         "tuoi": 21,
//         "lop": "MD19304",
//         "nganh": "UDPM"
//     }
    
//     console.log(use)

//     let kq = await userModel.create(use);
//     console.log(kq);

//     let users = await userModel.find();

//     res.send(users);

// })

// app.get('/xoa/:id', async (req, res) => {
//     await mongoose.connect(uri);

//     let id = req.params.id;
//     console.log(id);

//     // xu ly loi khi id khong dung
//     await userModel.deleteOne({_id: id});

//     res.redirect('../')
// }) 

// app.get('/update/:ten', async (req, res) => {
//     await mongoose.connect(uri);

//     console.log('Ket noi DB thanh cong');

//     let tenUser = req.params.ten;
//     console.log(tenUser);

//     let tenUserMoi = tenUser + ' Phien ban moi 2024';

//     await userModel.updateOne({ten: tenUser}, {ten: tenUserMoi});

//     let tens = await userModel.find({});

//     res.send(tens);
// })
