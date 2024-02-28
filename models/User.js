module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
        },
        username: {
        type: DataTypes.STRING,
        allowNull: false
        },
        email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
        },
        role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id'
        }
        }
    }, {
        timestamps: false
    });

    return User;
};  