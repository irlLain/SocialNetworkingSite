const users = require("../controllers/users.controllers");
const auth = require("../lib/authentication.js");

module.exports = function(app){

    app.route("/users")
    .get(auth.isAuthenticated, users.getAllUsers)
    .post(auth.isAuthenticated, users.addNewUser);

    app.route("/login")
    .post(users.login);

    app.route("/logout")
    .post(auth.isAuthenticated,users.logout);
}