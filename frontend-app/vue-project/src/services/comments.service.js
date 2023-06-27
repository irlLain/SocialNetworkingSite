const getAll = (id) => {
    return fetch("http://localhost:3333/articles/" + id + "/comments")
    .then((response) => {
        if(response.status === 200){
            return response.json();
        }else{
            throw "Something went wrong"
        }
    })
    .then((resJson) => {
        return resJson
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

const deleteComment = (comment_id) => {
    return fetch("http://localhost:3333/comments/"+comment_id,
    {
        method: "DELETE",
        headers: {
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then(response => {
        if(response.status === 200){
            return
        }else if(response.status === 401){
            throw "Not logged in"
        }else{
            throw "Something went wrong"
        }
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

const postComment = (id, CommentText) => {

    console.log(CommentText)
    return fetch("http://localhost:3333/articles/" + id + "/comments",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        },
        body: JSON.stringify({
            "comment_text": CommentText
        })
    })
    .then((response) => {
        if(response.status === 201){
            return response.json();
        }else if(response.status === 400){
            throw "Bad Request"
        }else{
            throw "Something went wrong"
        }
    })
    .then((resJson) => {return resJson})
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

export const CommentsService ={
    getAll,
    deleteComment,
    postComment
}