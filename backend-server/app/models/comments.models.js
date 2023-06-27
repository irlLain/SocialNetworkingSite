const Joi = require("joi");
const db = require("../../database");

const getArticleComments = (id, done) => {
    const results = [];
    const errors = [];
  /*  db.each(sql, [id], (err, row) => {
        if(err) return done(err)
        if(!row) {
            console.log("here :(")
            return done(404)
        }

        return done(null, {
            comment_id: row.comment_id,
            comment_text: row.comment_text,
            date_published: new Date(row.date_published).toLocaleDateString("en-EN")
        })
    })
    */

    db.each(
        "SELECT * FROM comments WHERE article_id=?",
        [id],
        (err,row) => {
            if(err) errors.push(err)

            results.push({
                comment_id: row.comment_id,
                comment_text: row.comment_text,
                date_published: new Date(row.date_published).toLocaleDateString("en-GB")
            });
        },
        (err, num_rows) => {
            console.log(errors)
            if(err) return done(err)
            return done(false, num_rows, results);
        }
    )
}

const getSingleComment = (id, done) => {
    const sql = 'SELECT * FROM comments WHERE comment_id=?'

    db.get(sql, [id], (err, row) => {
        if(err) return done(err)
        if(!row) return done(404)

        return done(null, {
            comment_id: row.comment_id,
        })
    })
}

const deleteComment = (id, done) => {
    const sql = 'SELECT * FROM comments WHERE comment_id=?'

    db.get(sql, [id], (err, row) => {
        if(err) return done(err)
        if(!row) return done(404)
        const sql = 'DELETE FROM comments WHERE comment_id=?'

       db.run(sql, [id], (err) => {
        return done(err)
       })
    })
}

const addNewComment = (comment_text, id, done) => {
    let date = Date.now();
    const sql = 'INSERT INTO comments (comment_text, date_published, article_id) VALUES (?,?,?)'
    let values = [comment_text, date, id];

    db.run(
        sql, 
        values,
        function(err){
            if(err) return done(err, null);

            return done(null, this.lastID);
        }
    )
}

module.exports = {
    getArticleComments: getArticleComments,
    deleteComment: deleteComment,
    addNewComment: addNewComment,
    getSingleComment: getSingleComment
}