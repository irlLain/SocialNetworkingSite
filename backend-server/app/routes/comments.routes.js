const comments = require("../controllers/comments.controllers");
const articles = require("../controllers/articles.controllers");
const auth = require("../lib/authentication.js");


module.exports = function(app){

    app.route("/articles/:article_id/comments")
        .get(comments.getArticleComments)
        .post(comments.createcomment);

        app.route("/comments/:comment_id")
        .delete(auth.isAuthenticated, comments.deleteComment);
}