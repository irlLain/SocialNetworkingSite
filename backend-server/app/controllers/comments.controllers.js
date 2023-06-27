const Joi = require("joi");
const db = require("../../database");
const articlesModels = require("../models/articles.models");
const CommentsModels = require("../models/comments.models");
var Filter = require('bad-words');
filter = new Filter();
//const articlesControllers = require("./articles.controllers");

const getArticleComments = (req, res) => {
    let article_id = parseInt(req.params.article_id);

    CommentsModels.getArticleComments(article_id, (err, num_rows, results) => {
        if(err === 404) return res.sendStatus(404)
        if(err) return res.sendStatus(500)

        return res.status(200).send(results)
    })
}

const getSingleComment = (req, res) => {
    let comment_id = parseInt(req.params.comment_id);

    CommentsModels.getSingleComment(comment_id, (err, result) => {
        if(err === 404) return res.sendStatus(404)
        if(err) return res.sendStatus(500)

        return res.status(200).send(result)
    })
}

const deleteComment = (req, res) => {
    let comment_id = parseInt(req.params.comment_id);

    CommentsModels.deleteComment(comment_id, (err,id) => {
        if(err === 404) return res.sendStatus(404)
    if (err){
        console.log(err);
        return res.sendStatus(500);
    }
    return res.sendStatus(200);
    })
}



const createcomment = (req, res) => {
    let article_id = parseInt(req.params.article_id)

    articlesModels.getSingleArticle(article_id, (err, result) => {
        if(err === 404) return res.sendStatus(404);
        if(err) return res.sendStatus(500)

        const schema = Joi.object({
            "comment_text": Joi.string().required(),
        })

        req.body.comment_text = filter.clean(req.body.comment_text);

        const { error } = schema.validate(req.body);
        console.log("err: " + error)
        if(error) return res.status(400).send(error.details[0].message);
    
       // let comments = Object.assign({}, req.body);
    
        CommentsModels.addNewComment(req.body.comment_text, article_id, (err, id) => {
            if(err) return res.sendStatus(500);
    
            return res.status(201).send({comment_id: id})
        })

    })
    
}

module.exports = {
    getArticleComments: getArticleComments,
    deleteComment: deleteComment,
    createcomment: createcomment,
    getSingleComment: getArticleComments
}