<template>
        <nav id="Navicontainer">
            <button><router-link to="/Dashboard">Dashboard</router-link></button>
            <button><router-link to="/">Home</router-link></button>
        </nav>

        <hr noshade>

    <div class="Welcome">
        <div>
            <img src="../tux.png" alt="Penguine" style="width:300px;height:200px;">
        </div>
        <div>
            <h1> {{article.title}}</h1>
            <h2>Written by: {{article.author}}</h2>
        </div>
        <div>
            <img src="../tux.png" alt="Penguine" style="width:300px;height:200px;">
        </div>
    </div>
    <hr  noshade>
    <h3>Published: {{article.date_published}}</h3>
    <h3>Edited: {{ article.date_edited }}</h3>
    <p>{{article.article_text}}</p>

    <button v-on:click="deleteArticle">Delete Article</button>
    
    <button v-on:click="showDiv">Edit Article</button>
    <div class="label" v-if="error">{{ error }}</div>
    <div v-if="buttonOn">
        <form @submit.prevent="handleEdit">
            <hr noshade>
            <label class="label" for = "ArticleTitle">Article Title: </label>
            <input class="input" type="ArticleTitle" name="ArticleTitle" v-model="ArticleTitle"/>
            <div class="label" v-show="(submitted && !ArticleTitle)">Title is required</div>

            <br/><br/>

            <label class="label" for="Author"> Author: </label>
            <input class="input" type="Author" name="Author" v-model="Author"/>
            <div class="label" v-show="(submitted && !Author)">Article Author is required</div>

            <br /><br />

            <label class="label" for="ArticleText"> Article Text: </label>
            <input class="input" type="ArticleText" name="ArticleText" v-model="ArticleText"/>
            <div class="label" v-show="(submitted && !ArticleText)">Article Text is required</div>

            <br /><br />

            <button>Edit</button>


        </form>
    </div>
    <hr noshade>
    <h3>Comments ({{num_comments}})</h3>
    <h3>Add Comment:</h3>

    <form @submit.prevent="handleSubmit">
        <input class = "input" type="CommentText" name="CommentText" v-model="CommentText"/>
        <div class = "label" v-show="(submitted && !CommentText)">Text is required</div>
        <button>Post</button>
    </form>

    <li class = "label" v-for="comment in comments" :key="comment_id">
                {{ comment.comment_text + " " + comment.date_published }}
               <button :id="comment.comment_id" v-on:click="deleteComment">Delete Comment</button>
    </li>
</template>

<script>
    import {articleService } from "../services/article.service"
    import { CommentsService } from "../services/comments.service"

    export default {
        data(){
            return {
                article: {},
                comments: [],
                num_comments: 0,
                comment: "",
                error: "",
                CommentText:"",
                buttonOn: false,
                ArticleTitle:"",
                Author: "",
                ArticleText: "",
                submitted: false
            }
        },
        created(){
            this.article.loading = true;
            this.comments.loading = true;

            articleService.getOne(this.$route.params.id)
            .then((article) => {
                this.article = article;

                CommentsService.getAll(this.$route.params.id)
                .then((comments) => {
                    this.comments = comments
                    this.num_comments = comments.length
                })
                .catch(error => this.error = error)

            })
            .catch(error => this.error = error);
        },
        methods:{
            deleteArticle(){
                articleService.deleteArticle(this.$route.params.id)
                .then(result => {
                    this.$router.push("/dashboard")})
                    .catch(error => {this.error = error;})                     
            },
        deleteComment(clicked_id){
                CommentsService.deleteComment(clicked_id.currentTarget.id)
                .then(result => {console.log("Deleted");                     
                this.$router.go();})       
                .catch(error => {this.error = error;})       
            },
            handleSubmit(e){
                console.log("help")
                this.submitted = true
                this.error = ""
                const {CommentText} = this

                if(!CommentText){
                    return;
                }

                console.log("help")

                CommentsService.postComment(this.$route.params.id, CommentText)
                .then(result => {
                    console.log("Posted Comment")
                    this.$router.go();
                })
                .catch(error => {
                    this.error = error;
                    this.loading = false;
                })
            },
            showDiv(){
                if(this.buttonOn == false){
                    this.buttonOn = true;
                }else{
                    this.buttonOn = false;
                }
           },
           handleEdit(){
                this.submitted = true
                this.error = ""
                const {ArticleTitle, Author, ArticleText} = this

                if(!(ArticleTitle && Author && ArticleText)){
                    return;
                }

                articleService.patchArticle(ArticleTitle, Author, ArticleText, this.$route.params.id)
                .then(result => {
                    console.log("Edited Article");
                    this.$router.go();
                })
                .catch(error => {
                    this.error = error;
                    this.loading = false;
                })
           }
        }
    }
</script>