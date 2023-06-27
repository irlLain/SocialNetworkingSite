const getAll = () => {
    return fetch("http://localhost:3333/articles")
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

const getOne = (id) => {
    return fetch("http://localhost:3333/articles/" + id)
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

const postArticle = (ArticleTitle, Author, ArticleText) => {

    console.log(ArticleTitle, Author, ArticleText)
    return fetch("http://localhost:3333/articles",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        },
        body: JSON.stringify({
            "title": ArticleTitle,
            "author": Author,
            "article_text": ArticleText
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

const deleteArticle = (id) => {
    return fetch("http://localhost:3333/articles/" + id,
    {
        method: "DELETE",
        headers: {
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then((response) => {
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

const patchArticle = (ArticleTitle, Author, ArticleText, id) => {
    return fetch("http://localhost:3333/articles/" + id,
    {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        },
        body: JSON.stringify({
            "title": ArticleTitle,
            "author": Author,
            "article_text": ArticleText
        })
    })
    .then((response) => {
        if(response.status === 200){
            return;
        }else if(response.status === 400){
            throw "Bad Request"
        }else if(response.status === 401){
            throw "Unauthorized"
        }else{
            throw "Something went wrong"
        }
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

export const articleService ={
    getAll,
    getOne,
    postArticle,
    deleteArticle,
    patchArticle
}