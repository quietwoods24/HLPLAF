const { DataTypes } = require('sequelize');
const sequelize = require('./db');

// https://sequelize.org/docs/v6/core-concepts/model-instances/
const User = sequelize.define('User', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    username: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    }
});

const Post = sequelize.define('Post', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    title: { 
        type: DataTypes.STRING, 
        allowNull: false
    },
    content: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    }
});

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    text: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
});

const Like = sequelize.define('Like', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    }
});

const Friend = sequelize.define('Friend', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    status: { 
        // https://sequelize.org/docs/v6/other-topics/other-data-types/
        type: DataTypes.ENUM('pending', 'accepted'),
        defaultValue: 'pending' 
    }
});

const RequestLog = sequelize.define('RequestLog', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    method: { 
        type: DataTypes.STRING 
    },
    url: { 
        type: DataTypes.STRING 
    },
    query_params: { 
        type: DataTypes.JSON 
    },
    body: { 
        type: DataTypes.JSON 
    },
    timestamp: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
});

// https://sequelize.org/docs/v7/associations/has-many/
User.hasMany(Post, { 
    foreignKey: 'userId', 
    onDelete: 'CASCADE' 
});
// https://sequelize.org/docs/v7/associations/belongs-to/
Post.belongsTo(User, { 
    foreignKey: 'userId' 
});
User.hasMany(Comment, { 
    foreignKey: 'userId', 
    onDelete: 'CASCADE' 
});
Comment.belongsTo(User, { 
    foreignKey: 'userId' 
});
Post.hasMany(Comment, { 
    foreignKey: 'postId', 
    onDelete: 'CASCADE' 
});
Comment.belongsTo(Post, { 
    foreignKey: 'postId' 
});
User.hasMany(Like, { 
    foreignKey: 'userId', 
    onDelete: 'CASCADE' 
});
Like.belongsTo(User, { 
    foreignKey: 'userId'
});
Post.hasMany(Like, { 
    foreignKey: 'postId', 
    onDelete: 'CASCADE' 
});
Like.belongsTo(Post, { 
    foreignKey: 'postId' 
});

// https://sequelize.org/docs/v7/associations/belongs-to-many/
User.belongsToMany(User, { 
    as: 'Friends', 
    through: Friend, 
    foreignKey: 'userId', 
    otherKey: 'friendId' 
});

module.exports = {
    sequelize,
    User,
    Post,
    Comment,
    Like,
    Friend,
    RequestLog
};