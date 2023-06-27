/*
    Test the Article Management endpoints
*/
const chai = require("chai")
const chaiHttp = require("chai-http");

const expect = chai.expect
chai.use(chaiHttp)

const path = require('path');
const filename = path.basename(__filename);

const SERVER_URL = "http://localhost:3333"
let ARTICLE_ID = 0;


describe("Test getting all articles.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it("Should return 200, and be an array of created articles", () => {
            return chai.request(SERVER_URL)
                .get("/articles")
                .then((res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body.length).to.equal(25)

                    res.body.forEach(element => {
                        expect(element).to.have.property("article_id")
                        expect(element).to.have.property("title")
                        expect(element).to.have.property("author")
                        expect(element).to.have.property("date_published")
                        expect(element).to.have.property("date_edited")
                        expect(element).to.have.property("article_text")
                        expect(element).to.not.have.property("created_by")
                    });

                    
                })
                .catch((err) => {
                    throw err
                })
    })
})

describe("Test getting a single article.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it("Should return 200, and be an JSON object the article", () => {

    return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[0].article_id
                       
            return chai.request(SERVER_URL)
                .get("/articles/" + ARTICLE_ID)
                .then((res) => {
                    expect(res).to.have.status(200)

                    expect(res.body).to.have.property("article_id")
                    expect(res.body).to.have.property("title")
                    expect(res.body).to.have.property("author")
                    expect(res.body).to.have.property("date_published")
                    expect(res.body).to.have.property("date_edited")
                    expect(res.body).to.have.property("article_text")
                    expect(res.body).to.not.have.property("created_by")
                })
                .catch((err) => {
                    throw err
                })
        })       
        .catch((err) => {
            throw err
        })
    })

    it("Should return 404 if getting a single article with an ID that doesn't exist (0).", () => {
        return chai.request(SERVER_URL)
        .get("/articles/0")
        .then((res) => {
            expect(res).to.have.status(404)
        })
        .catch((err) => {
            throw err
        })
    })

    it("Should return 404 if getting a single article with an ID that doesn't exist (string)", () => {
        return chai.request(SERVER_URL)
        .get("/articles/string")
        .then((res) => {
            expect(res).to.have.status(404)
        })
        .catch((err) => {
            throw err
        })
    })  
})