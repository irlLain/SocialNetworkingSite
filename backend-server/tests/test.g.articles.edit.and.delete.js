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



// Edit not logged in
describe("Test updating a single article when not logged in.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it("Should return 401", () => {

    return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[0].article_id
                       
            return chai.request(SERVER_URL)
                .patch("/articles/" + ARTICLE_ID)
                .send({
                    "author": "New author",
                    "title": "New title",
                    "article_text": "New article text"
                })
                .then((res) => {
                    expect(res).to.have.status(401)
                })
                .catch((err) => {
                    throw err
                })
        })       
        .catch((err) => {
            throw err
        })
    }) 
})

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

// Edit logged in
describe("Test updating a single article when logged in as admin.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it("Should return 200", () => {

    return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[0].article_id
                       
            return chai.request(SERVER_URL)
                .patch("/articles/" + ARTICLE_ID)
                .set('X-Authorization', ADMIN_TOKEN)
                .send({
                    "author": "New author",
                    "title": "New title",
                    "article_text": "New article text"
                })
                .then((res) => {
                    expect(res).to.have.status(200)
                })
                .catch((err) => {
                    throw err
                })
        })       
        .catch((err) => {
            throw err
        })
    }) 
})


describe("Test updating a single article when logged in as admin.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    // Edit logged in, just title
    it("Should return 200 when just the title is sent", () => {

    return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[0].article_id
                       
            return chai.request(SERVER_URL)
                .patch("/articles/" + ARTICLE_ID)
                .set('X-Authorization', ADMIN_TOKEN)
                .send({
                    "title": "New new title"
                })
                .then((res) => {
                    expect(res).to.have.status(200)
                })
                .catch((err) => {
                    throw err
                })
        })       
        .catch((err) => {
            throw err
        })
    }) 

    // Edit logged in, just author
    it("Should return 200 when just the author is sent", () => {

        return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[0].article_id
                       
            return chai.request(SERVER_URL)
                .patch("/articles/" + ARTICLE_ID)
                .set('X-Authorization', ADMIN_TOKEN)
                .send({
                    "author": "New new author"
                })
                .then((res) => {
                    expect(res).to.have.status(200)
                })
                .catch((err) => {
                    throw err
                })
        })       
        .catch((err) => {
            throw err
        })
    })

    // Edit logged in, just article text
    it("Should return 200 when just the article text is sent", () => {

        return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[0].article_id
                       
            return chai.request(SERVER_URL)
                .patch("/articles/" + ARTICLE_ID)
                .set('X-Authorization', ADMIN_TOKEN)
                .send({
                    "article_text": "New new article text"
                })
                .then((res) => {
                    expect(res).to.have.status(200)
                })
                .catch((err) => {
                    throw err
                })
        })       
        .catch((err) => {
            throw err
        })
    })

    // Edit logged in, just title and author
    it("Should return 200 when title and author are sent", () => {

        return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[0].article_id
                        
            return chai.request(SERVER_URL)
                .patch("/articles/" + ARTICLE_ID)
                .set('X-Authorization', ADMIN_TOKEN)
                .send({
                    "author": "New author 3",
                    "title": "New title 3",
                })
                .then((res) => {
                    expect(res).to.have.status(200)
                })
                .catch((err) => {
                    throw err
                })
        })       
        .catch((err) => {
            throw err
        })
    })
    
    // Edit logged in, just title and article text
    it("Should return 200 when just the title and article text are sent", () => {

        return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[0].article_id
                       
            return chai.request(SERVER_URL)
                .patch("/articles/" + ARTICLE_ID)
                .set('X-Authorization', ADMIN_TOKEN)
                .send({
                    "title": "New title 4",
                    "article_text": "New article text 4"
                })
                .then((res) => {
                    expect(res).to.have.status(200)
                })
                .catch((err) => {
                    throw err
                })
        })       
        .catch((err) => {
            throw err
        })
    })

    // Edit logged in, just author and article_text
    it("Should return 200 when just the author and article_text are sent", () => {

        return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[0].article_id
                       
            return chai.request(SERVER_URL)
                .patch("/articles/" + ARTICLE_ID)
                .set('X-Authorization', ADMIN_TOKEN)
                .send({
                    "author": "New author 5",
                    "article_text": "New article text 5"
                })
                .then((res) => {
                    expect(res).to.have.status(200)
                })
                .catch((err) => {
                    throw err
                })
        })       
        .catch((err) => {
            throw err
        })
    })

    // Edit logged in, additional field
    it("Should return 400 when an additional field is sent", () => {

        return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[0].article_id
                        
            return chai.request(SERVER_URL)
                .patch("/articles/" + ARTICLE_ID)
                .set('X-Authorization', ADMIN_TOKEN)
                .send({
                    "author": "New author 6",
                    "title": "New title 6",
                    "article_text": "New article text 6",
                    "extra": "field"
                })
                .then((res) => {
                    expect(res).to.have.status(400)
                })
                .catch((err) => {
                    throw err
                })
        })       
        .catch((err) => {
            throw err
        })
    }) 

    // edit article that doesn't exit 404
    it("Should return 404 if the article ID doesnt exist (e.g. 0)", () => {

        return chai.request(SERVER_URL)
        .get("/articles")
        .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')

            ARTICLE_ID = res.body[0].article_id
                       
            return chai.request(SERVER_URL)
                .patch("/articles/0")
                .set('X-Authorization', ADMIN_TOKEN)
                .send({
                    "author": "New author 7",
                    "title": "New title 7",
                    "article_text": "New article text 7"
                })
                .then((res) => {
                    expect(res).to.have.status(404)
                })
                .catch((err) => {
                    throw err
                })
        })       
        .catch((err) => {
            throw err
        })
    })
})



describe("Test deleting a single article.", () => {
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

            ARTICLE_ID = res.body[0].article_id
                       
            return chai.request(SERVER_URL)
                .delete("/articles/" + ARTICLE_ID)
                .then((res) => {
                    expect(res).to.have.status(401)
                })
                .catch((err) => {
                    throw err
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

            ARTICLE_ID = res.body[0].article_id
                       
            return chai.request(SERVER_URL)
                .delete("/articles/" + ARTICLE_ID)
                .set('X-Authorization', ADMIN_TOKEN)
                .then((res) => {
                    expect(res).to.have.status(200)
                })
                .catch((err) => {
                    throw err
                })
        })       
        .catch((err) => {
            throw err
        })
    }) 

    //delete same again
    it("Should return 404 if the user trying to delete the article just deleted in the previous test", () => {
             
        return chai.request(SERVER_URL)
        .delete("/articles/" + ARTICLE_ID)
        .set('X-Authorization', ADMIN_TOKEN)
        .then((res) => {
            expect(res).to.have.status(404)
        })
        .catch((err) => {
            throw err
        })       
    })

    //delete article that doesn't exist 404
    it("Should return 404 if trying to delete an article that doesn't exist (e.g., 0)", () => {
             
        return chai.request(SERVER_URL)
        .delete("/articles/0")
        .set('X-Authorization', ADMIN_TOKEN)
        .then((res) => {
            expect(res).to.have.status(404)
        })
        .catch((err) => {
            throw err
        })      
    })
})
