const fs = require("fs")
const chai = require("chai")
const chaiHttp = require("chai-http")

const expect = chai.expect
chai.use(chaiHttp)

const path = require('path')
const filename = path.basename(__filename)

const SERVER_URL = "http://localhost:3333"

let SESSION_TOKEN = ""
let ARTICLE_ID = 0

const good_user_data = require('./data/mock_users_good.json')

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

describe("Create an article to test comments.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it("Should return 201 with an aritcle ID", () => {
        return chai.request(SERVER_URL)
            .post("/articles")
            .set('X-Authorization', SESSION_TOKEN)
            .send({
                "title": "Comment test title",
                "author": "Ash",
                "article_text": "Hello world"
             })
            .then((res) => {
                expect(res).to.have.status(201)
                expect(res).to.be.json
                expect(res.body).to.have.property("article_id")

                ARTICLE_ID = res.body.article_id
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 201 when posting a valid comment to the new article: comment 1", () => {

        return chai.request(SERVER_URL)
        .post("/articles/" + ARTICLE_ID + "/comments")
        .send({
            "comment_text": "Comment 1"
        })
        .then((res) => {
            expect(res).to.have.status(201)
        })
        .catch((err) => {
            console.log(err, id)
            throw err
        }) 
    })

    it("Should return 201 when posting a valid comment to the new article: comment 2", () => {

        return chai.request(SERVER_URL)
        .post("/articles/" + ARTICLE_ID + "/comments")
        .send({
            "comment_text": "Comment 2"
        })
        .then((res) => {
            expect(res).to.have.status(201)
        })
        .catch((err) => {
            console.log(err, id)
            throw err
        }) 
    })

    it("Should return 201 when posting a valid comment to the new article: comment 3", () => {

        return chai.request(SERVER_URL)
        .post("/articles/" + ARTICLE_ID + "/comments")
        .send({
            "comment_text": "Comment 3"
        })
        .then((res) => {
            expect(res).to.have.status(201)
        })
        .catch((err) => {
            console.log(err, id)
            throw err
        }) 
    })
})

describe("Test getting all comments for article: " + ARTICLE_ID, () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it("Should return 200, and be an array of created comments", () => {
            return chai.request(SERVER_URL)
                .get("/articles/" + ARTICLE_ID + "/comments")
                .then((res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body.length).to.equal(3)

                    res.body.forEach(element => {
                        expect(element).to.have.property("comment_id")
                        expect(element).to.have.property("date_published")
                        expect(element).to.have.property("comment_text")
                    });              
                })
                .catch((err) => {
                    throw err
                })
    })
})

