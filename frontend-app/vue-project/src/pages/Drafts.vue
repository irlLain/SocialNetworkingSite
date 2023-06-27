<template>
    <nav class="Navicontainer">
        <button><router-link to="/Dashboard">Dashboard</router-link></button>
    </nav>

    <hr noshade>
    <div class="Welcome">
        <div>
            <img src="../kerop.gif" alt="Frog" style="width:150px;height:150px;">
        </div>
        <div>
            <h1>⋆｡°✩Create a draft✩°｡⋆</h1>
        </div>
        <div>
            <img src="../kerop.gif" alt="Frog" style="width:150px;height:150px;">
        </div>
    </div>
    <hr noshade>

    <form @submit.prevent="handleSubmit">
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
            
            <p>{{(ArticleTitle + " " + ArticleText)}}</p>

            <button>Post</button>

            
            <div v-if="error">{{ error }}</div>
        </form>

        <p>{{ "Title: " + draft.title + " by " + draft.author + ". Text: " + draft.article_text}}</p>
        <button v-on:click="PostDraft">Post</button>
        
</template>

<script>
import { articleService } from '../services/article.service';

    export default{
        mounted(){
            this.draft = JSON.parse(localStorage.getItem('Drafts'));
        },
        data(){
            return{
                ArticleTitle:"",
                Author: "",
                ArticleText: "",
                submitted: false,
                draft: []
            }
        },
        methods:{
            handleSubmit(e){

                var Draft = {title: this.ArticleTitle, author: this.Author, article_text: this.ArticleText};
                this.draft = Draft; 
                localStorage.setItem('Drafts', JSON.stringify(Draft));
            },

            PostDraft(){
                articleService.postArticle(this.draft.title, this.draft.author, this.draft.article_text)
                .then(result => {
                    console.log("Posted Article")
                    
                    this.$router.push("/Dashboard")
                })
                .catch(error => {
                    this.error = error;
                    this.loading = false;
                })
            }
        }
    }
</script>