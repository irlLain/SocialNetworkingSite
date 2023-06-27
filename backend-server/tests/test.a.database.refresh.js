const db = require("../database")

const sql = 'DELETE FROM comments'

db.run(sql, [], function(err){
    if(err) throw err

    console.log("Comments table: All data deleted")
    const sql = 'DELETE FROM articles'

    db.run(sql, [], function(err){
        if(err) throw err

        console.log("Articles table: All data deleted")
        const sql = 'DELETE FROM users WHERE first_name != "admin"'

        db.run(sql, [], function(err){
            if(err) throw err

            console.log("Users table: All data deleted, except admin account")
        })
    })
})


