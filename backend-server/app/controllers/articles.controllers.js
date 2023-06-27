const Joi = require("joi");
const db = require("../../database");
const articlesModels = require("../models/articles.models");

const getAll = (req, res) => {
    articlesModels.getAllArticles((err, num_rows, results) =>{
        if(err) return res.sendStatus(500);
        return res.status(200).send(results); 
    })
}

const create = (req, res) => {
    console.log("f;uffy bunny")
    const schema = Joi.object({
        "title": Joi.string().required(),
        "author": Joi.string().required(),
        "article_text": Joi.string().required()
    })

    const { error } = schema.validate(req.body);
    console.log("err: " + error)
    if(error) return res.status(400).send(error.details[0].message);

    let article = Object.assign({}, req.body);

    articlesModels.addNewArticle(article, (err, id) => {
        if(err) return res.sendStatus(500);

        return res.status(201).send({article_id: id})
    })
}

const getSingleArticle = (req, res) => {
    let article_id = parseInt(req.params.article_id);

    articlesModels.getSingleArticle(article_id, (err, result) => {
        if(err === 404) return res.sendStatus(404)
        if(err) return res.sendStatus(500)

        return res.status(200).send(result)
    })
}

const updateArticle = (req, res) => {
    let article_id = parseInt(req.params.article_id);

    articlesModels.getSingleArticle(article_id, (err, result) => {
        if(err === 404) return res.sendStatus(404);
        if(err) return res.sendStatus(500);

        const schema = Joi.object({
            "title": Joi.string(),
            "author": Joi.string(),
            "article_text": Joi.string()
        })

        const { error } = schema.validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        if(req.body.hasOwnProperty("title")){
            result.title =  req.body.title
        }
        if(req.body.hasOwnProperty("author")){
            result.author =  req.body.author
        }
        if(req.body.hasOwnProperty("article_text")){
            result.article_text =  req.body.article_text
        }

        articlesModels.updateArticle(article_id, result, (err, id) => {
            if(err){
                console.log(err)
                return res.sendStatus(500)
            }

            return res.sendStatus(200)
        })

        // return done(null, {
        //     article_id: row.article_id,
        //     title: row.title,
        //     author: row.author,
        //     date_published: new Date(row.date_published).toLocaleDateString(),
        //     date_edited: new Date(row.date_edited).toLocaleDateString(),
        //     article_text: row.article_text
        // })
    })
}


const deleteArticle = (req, res) => {
    let article_id = parseInt(req.params.article_id);

    articlesModels.getSingleArticle(article_id, (err, result) => {
        if(err === 404) return res.sendStatus(404)
    

    articlesModels.deleteArticle(article_id, (err,id) => {
    if (err){
        console.log(err);
        return res.sendStatus(404);
    }
    return res.sendStatus(200);
    })
})
}



module.exports = {
    getAll: getAll,
    create: create,
    getSingleArticle: getSingleArticle,
    updateArticle: updateArticle,
    deleteArticle: deleteArticle
}