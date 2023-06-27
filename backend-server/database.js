const sqlite3 = require('sqlite3').verbose()
const crypto = require("crypto")

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.') 

        db.run(`CREATE TABLE users (
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    first_name text,
                    last_name text,
                    email text UNIQUE,
                    password text,
                    salt text,
                    session_token text,
                    CONSTRAINT email_unique UNIQUE (email)
                )`,
            (err) => {

                if(err){
                    console.log("Users table already created")
                }else{
                    console.log("Users table created")
                }


                const ADMIN_PASSWORD = "Admin123!"

                const getHash = function(password, salt){
                    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
                };

                const INSERT = 'INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?,?,?,?,?)'
                const salt = crypto.randomBytes(64);
                const hash = getHash(ADMIN_PASSWORD, salt);

                db.run(INSERT, ["admin", "admin", "admin@admin.com", hash, salt.toString('hex')], (err) => {
                    if(err){
                        console.log("Admin account already exists")
                    } 
                })
            }
        )

        db.run(`CREATE TABLE articles (
                    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title text,
                    author text,
                    article_text text,
                    date_published INTEGER,
                    date_edited INTEGER,
                    created_by INTEGER,
                    FOREIGN KEY(created_by) REFERENCES users(user_id)
                )`,
            (err) => {
                if(err){
                    console.log("Articles table already created")
                }else{
                    console.log("Articles table created")
                }
            }
        )

        db.run(`CREATE TABLE comments (
                    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    comment_text text,
                    date_published INTEGER,
                    article_id INTEGER,
                    FOREIGN KEY(article_id) REFERENCES articles(article_id)
                )`,
            (err) => {
                if(err){
                    console.log("Comments table already created")
                }else{
                    console.log("Comments table created")
                }
            }
        )

    }
});


module.exports = db