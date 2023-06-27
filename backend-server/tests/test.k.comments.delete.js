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
const ADMIN_EMAIL = "admin@admin.com"
const ADMIN_PASSWORD = "Admin123!"
let ADMIN_TOKEN = ""
let ARTICLE_COMMENTS = [];

//login
describe("Log into admin account.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it("Should return 200, and JSON with user_id and session_token of admin.", () => {
        return chai.request(SERVER_URL)
            .post("/login")
            .send({
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
                })
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.be.json
                expect(res.body).to.have.property("user_id")
                expect(res.body).to.have.property("session_token")
                ADMIN_TOKEN = res.body.session_token
            })
            .catch((err) => {
                throw err
            })
    })
})


describe("Test deleting a single comment.", () => {
    before(() => {
        console.log("[Script: " + filename + "]")
    })


    //delete not logged in
    it("Should return 401 if the user is not logged in", () => {

        return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[res.body.length - 1].article_id
    
            return chai.request(SERVER_URL)
                .get("/articles/" + ARTICLE_ID + "/comments")
                .then((res) => {
                    ARTICLE_COMMENTS = res.body

                    return chai.request(SERVER_URL)
                    .delete("/comments/" + ARTICLE_COMMENTS[0].comment_id)
                    .then((res) => {
                        expect(res).to.have.status(401)
                    })
                    .catch((err) => {
                        throw err
                    })
                })   
        })       
        .catch((err) => {
            throw err
        })
    }) 

    //delete logged in
    it("Should return 200 if the user is logged in as admin", () => {

        return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[res.body.length - 1].article_id

            return chai.request(SERVER_URL)
                .get("/articles/" + ARTICLE_ID + "/comments")
                .then((res) => {
                    ARTICLE_COMMENTS = res.body

                    return chai.request(SERVER_URL)
                    .delete("/comments/" + ARTICLE_COMMENTS[0].comment_id)
                    .set("X-Authorization", ADMIN_TOKEN)
                    .then((res) => {
                        expect(res).to.have.status(200)
                    })
                    .catch((err) => {
                        throw err
                    })
                })   
        })       
        .catch((err) => {
            throw err
        })
    })

    //delete same again
    it("Should return 404 if the user trying to delete the comment just deleted in the previous test", () => {
             
        return chai.request(SERVER_URL)
        .delete("/comments/" + ARTICLE_COMMENTS[0].comment_id)
        .set("X-Authorization", ADMIN_TOKEN)
        .then((res) => {
            expect(res).to.have.status(404)
        })
        .catch((err) => {
            throw err
        })     
    })

    //delete comment that doesn't exist 404
    it("Should return 404 if trying to delete an comment that doesn't exist (e.g., 0)", () => {
             
        return chai.request(SERVER_URL)
        .delete("/comments/0")
        .set('X-Authorization', ADMIN_TOKEN)
        .then((res) => {
            expect(res).to.have.status(404)
        })
        .catch((err) => {
            throw err
        })      
    })
})
