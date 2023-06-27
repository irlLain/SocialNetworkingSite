/*
    Test the Article Management endpoints
*/
const chai = require("chai")
const chaiHttp = require("chai-http")

const expect = chai.expect
chai.use(chaiHttp)

const path = require('path')
const filename = path.basename(__filename)

const SERVER_URL = "http://localhost:3333"

const good_comment_data = require('./data/mock_comments_good.json')
let articles = []


describe("Test creation of comments.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    good_comment_data.forEach((comment) => {
        it("Should return 201 when posting a valid comment to a random article", () => {

            return chai.request(SERVER_URL)
            .get("/articles")
            .then((res) => {
                res.body.forEach((article) => {
                    articles.push(article.article_id)

                    if(articles.length === res.body.length){
                        let id = articles[Math.floor(Math.random() * articles.length)]
                        if(id === 0) id = 1

                        return chai.request(SERVER_URL)
                            .post("/articles/" + id + "/comments")
                            .send({
                                "comment_text": comment.comment_text
                            })
                            .then((res) => {
                                expect(res).to.have.status(201)
                            })
                            .catch((err) => {
                                console.log(err, id)
                                throw err
                            })
                    }
                })
            })  
        })
    })

    it("Should return 400 when posting a comment to a random article with no text", () => {

        return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            res.body.forEach((article) => {
                articles.push(article.article_id)

                if(articles.length === res.body.length){
                    let id = articles[Math.floor(Math.random() * articles.length)]
                    if(id === 0) id = 1

                    return chai.request(SERVER_URL)
                        .post("/articles/" + id + "/comments")
                        .send({
                            "comment_text": ""
                        })
                        .then((res) => {
                            expect(res).to.have.status(400)
                        })
                        .catch((err) => {
                            console.log(err, id)
                            throw err
                        })
                }
            })
        })  
    })

    it("Should return 400 when posting a comment to a random article with no a missing comment_text", () => {

        return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            res.body.forEach((article) => {
                articles.push(article.article_id)

                if(articles.length === res.body.length){
                    let id = articles[Math.floor(Math.random() * articles.length)]
                    if(id === 0) id = 1

                    return chai.request(SERVER_URL)
                        .post("/articles/" + id + "/comments")
                        .send({
                        })
                        .then((res) => {
                            expect(res).to.have.status(400)
                        })
                        .catch((err) => {
                            console.log(err, id)
                            throw err
                        })
                }
            })
        })  
    })

    it("Should return 400 when posting a comment to a random article with an additional field", () => {

        return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            res.body.forEach((article) => {
                articles.push(article.article_id)

                if(articles.length === res.body.length){
                    let id = articles[Math.floor(Math.random() * articles.length)]
                    if(id === 0) id = 1

                    return chai.request(SERVER_URL)
                        .post("/articles/" + id + "/comments")
                        .send({
                            "comment_text": "hello",
                            "extra": "field"
                        })
                        .then((res) => {
                            expect(res).to.have.status(400)
                        })
                        .catch((err) => {
                            console.log(err, id)
                            throw err
                        })
                }
            })
        })  
    })

    it("Should return 404 when posting a comment to an article that doesn't exist (e.g., 0)", () => {

        return chai.request(SERVER_URL)
            .post("/articles/0/comments")
            .send({
                "comment_text": "hello",
            })
            .then((res) => {
                expect(res).to.have.status(404)
            })
            .catch((err) => {
                console.log(err, id)
                throw err
            }) 
    })
})