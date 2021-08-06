const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const cookieDuration = 24 * 60 * 60 * 1000; //1day

const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: cookieDuration,
    });
};

module.exports.signUp = async(req, res) => {
    const { pseudo, email, password, box } = req.body;

    try {
        const user = await UserModel.create({ pseudo, email, password, box });
        res.status(201).json({ user: user._id });
    } catch (err) {
        res.status(200).send({ err });
    }
};

module.exports.signIn = async(req, res) => {
    const { pseudo, password } = req.body;

    try {
        const user = await UserModel.login(pseudo, password);
        const token = createToken(user._id); //generate token
        res.cookie("jwt", token, { httpOnly: true, maxAge: cookieDuration });
        res.status(200).json({ user: user._id });
    } catch (err) {
        res.status(200).json(err);
    }
};

module.exports.logout = async(req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
};