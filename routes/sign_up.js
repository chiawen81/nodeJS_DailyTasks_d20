const express = require('express');
const router = express.Router();
const handleErrorAsync = require("../service/handleErrorAsync");
const sendBackJWT = require("../service/auth");
var validator = require('validator');
var bcrypt = require('bcryptjs');
const User = require("../models/users");

// 註冊
router.post('/', handleErrorAsync(async (req, res, next) => {
    let { email, password, confirmPassword, name } = req.body;
    let emailValidator = validator.isEmail(email);
    let passwordValidator = validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 }) && (password === confirmPassword);
    let nameValidator = validator.isLength(name, { min: 2, max: undefined });

    console.log('passwordValidator ', passwordValidator);
    console.log('emailValidator', emailValidator);
    console.log('nameValidator', nameValidator);

    if (passwordValidator && emailValidator && nameValidator) {
        const hashPassword = await bcrypt.hash(password, 12);
        console.log('hashPassword', hashPassword);
        const newUser = await User.create({
            email,
            password: hashPassword,
            name
        });
        console.log('newUser', newUser);

        // 產生 JWT token
        sendBackJWT(req.body, res, 200);

    } else {
        console.log(2)
        res.status(200).json({
            status: 'success',
            valid: false,
            errorMsg: "請檢查您的資料是否正確"
        });
    };
}));



module.exports = router;
