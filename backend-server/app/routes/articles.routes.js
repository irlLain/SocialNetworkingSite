const articles = require("../controllers/articles.controllers");
const auth = require("../lib/authentication.js");

module.exports = function(app){

        app.route("/articles")
        .get(articles.getAll)
        .post(auth.isAuthenticated, articles.create);

    app.route("/articles/:article_id")
        .get(articles.getSingleArticle)
        .patch(auth.isAuthenticated, articles.updateArticle)
        .delete(auth.isAuthenticated, articles.deleteArticle);
}