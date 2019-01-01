var mongoose = require('mongoose');
// User Schema
var UserSchema = mongoose.Schema({
    email: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    gender: {
        type: String
    },
    birthdate: {
        type: String
    },
    type: {
        type: String
    },
    jobs: [{
        job_desc: String
        , job_loc: String
        , job_title: String
        , company_name: String
        , candidates: [
            {id: String, approved: Boolean}
        ]
    }]
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
    newUser.save(callback);

};

module.exports.getUserByEmail = function (email, callback) {
    var query = {email: email};
    User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};
