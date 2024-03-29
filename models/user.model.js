const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 55,
        unique: true,
        trimp: true,
    },
    email: {
        type: String,
        required: true,
        validate: [isEmail],
        lowercase: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    box: {
        type: [String],
    },
}, {
    timestamps: true,
});

// play function before save
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(pseudo, password) {
    const user = await this.findOne({ pseudo });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
};

// mongoDB always put s on table name
const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;