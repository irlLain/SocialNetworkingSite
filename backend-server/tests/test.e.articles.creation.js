/*
    Test the Article Management endpoints
*/

const fs = require("fs")
const chai = require("chai")
const chaiHttp = require("chai-http")

const expect = chai.expect
chai.use(chaiHttp)

const path = require('path')
const filename = path.basename(__filename)

const SERVER_URL = "http://localhost:3333"

let SESSION_TOKEN = ""

const good_user_data = require('./data/mock_users_good.json')
const good_article_data = require('./data/mock_articles_good.json')
const bad_article_data = require('./data/mock_articles_bad.json')

describe("Test creation of articles if not logged in.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    good_article_data.forEach((article) => {
        it("Should return 401", () => {
            return chai.request(SERVER_URL)
                .post("/articles")
                .send({
                    "title": article.title,
                    "author": article.author,
                    "article_text": article.article_text
                 })
                .then((res) => {
                    expect(res).to.have.status(401)
                })
                .catch((err) => {
                    throw err
                })
        })
    })
})

describe("Log into user account.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it("Should return 200, and JSON with user_id and session_token of user.", () => {
        return chai.request(SERVER_URL)
            .post("/login")
            .send({
                "email": good_user_data[0].email,
                "password": good_user_data[0].password,
                })
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.be.json
                expect(res.body).to.have.property("user_id")
                expect(res.body).to.have.property("session_token")
                SESSION_TOKEN = res.body.session_token
            })
            .catch((err) => {
                throw err
            })
    })

})


describe("Test successful creation of articles when logged in.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    good_article_data.forEach((article) => {
        it("Should return 201, and JSON with article_id of new article", () => {
            return chai.request(SERVER_URL)
                .post("/articles")
                .set('X-Authorization', SESSION_TOKEN)
                .send({
                    "title": article.title,
                    "author": article.author,
                    "article_text": article.article_text
                 })
                .then((res) => {
                    expect(res).to.have.status(201)
                    expect(res).to.be.json
                    expect(res.body).to.have.property("article_id")
                })
                .catch((err) => {
                    throw err
                })
        })
    })
})

describe('Test malformed creation of articles, when logged in.', () => {

    before(() => {
        console.log('[Script: ' + filename + ']')
    });

    bad_article_data.forEach((article) => {
        it('Should return 400 status code: ' + article.test_description, () => {
            return chai.request(SERVER_URL)
                .post('/articles')
                .set('X-Authorization', SESSION_TOKEN)
                .send({
                    "title": article.title,
                    "author": article.author,
                    "article_text": article.article_text
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                })
                .catch((err) => {
                    throw err
                });
        });
    });

    it('Should return 400 status code: missing title', () => {
        return chai.request(SERVER_URL)
            .post('/articles')
            .set('X-Authorization', SESSION_TOKEN)
            .send({
                "author": good_article_data[0].author,
                "article_text": good_article_data[0].article_text
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 400 status code: missing author', () => {
        return chai.request(SERVER_URL)
            .post('/articles')
            .set('X-Authorization', SESSION_TOKEN)
            .send({
                "title": good_article_data[0].title,
                "article_text": good_article_data[0].article_text
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 400 status code: missing text', () => {
        return chai.request(SERVER_URL)
            .post('/articles')
            .set('X-Authorization', SESSION_TOKEN)
            .send({
                "title": good_article_data[0].title,
                "author": good_article_data[0].author
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 400 status code: extra field', () => {
        return chai.request(SERVER_URL)
            .post('/articles')
            .set('X-Authorization', SESSION_TOKEN)
            .send({
                "title": good_article_data[0].title,
                "author": good_article_data[0].author,
                "article_text": good_article_data[0].article_text,
                "extra": "field"
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err
            });
    });
});
