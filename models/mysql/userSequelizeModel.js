const Sequelize = require("sequelize");
const { sequelize } = require("../../util/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    email: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { notNull: true, isEmail: true } },
    firstname: { type: Sequelize.STRING, allowNull: false, validate: { notNull: true } },
    lastname: { type: Sequelize.STRING, allowNull: false, validate: { notNull: true } },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            min: 6,
        },
        set(value) {
            this.setDataValue("password", bcrypt.hashSync(value, 12));
        },
    },
    confirmpassword: {
        type: Sequelize.VIRTUAL,
        validate: {
            min: 6,
            isEqual(value) {
                if (!bcrypt.compareSync(value, this.password)) {
                    throw new Error("Password and confirm password fields value must be matched");
                }
            },
        },
    },
});

module.exports = User;
