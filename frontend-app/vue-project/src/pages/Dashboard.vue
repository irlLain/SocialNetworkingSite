<template>
        <nav class="Navicontainer">
            <button><router-link to="/users">Users</router-link></button>
            <button><router-link to="/createuser">Create User</router-link></button>
            <button><router-link to="/Drafts">Create Draft</router-link></button>
            <button v-on:click="logout">Logout</button>
        </nav>
        <hr noshade>
        <div class="Welcome">
        <div>
            <img src="../mymelo.png" alt="Bunny" style="width:200px;height:200px;">
        </div>
        <div>
            <h1>⋆｡°✩Welcome to your DashBoard✩°｡⋆</h1> 
        </div>
        <div>
            <img src="../mymelo.png" alt="Bunny" style="width:200px;height:200px;">
        </div>
    </div>
        <hr noshade>
        <div>
        <form @submit.prevent="handleSubmit">
            <h3>Create an Article:</h3>
            <label class = "label" for = "ArticleTitle">Article Title: </label>
            <input class="input" type="ArticleTitle" name="ArticleTitle" v-model="ArticleTitle"/>
            <div class="label" v-show="(submitted && !ArticleTitle)">Title is required</div>

            <br/><br/>

            <label class = "label" for="Author"> Author: </label>
            <input class="input" type="Author" name="Author" v-model="Author"/>
            <div class="label" v-show="(submitted && !Author)">Article Author is required</div>

            <br /><br />

            <label class = "label" for="ArticleText"> Article Text: </label>
            <input class="input" type="ArticleText" name="ArticleText" v-model="ArticleText"/>
            <div class="label" v-show="(submitted && !ArticleText)">Article Text is required</div>
            
            <br /><br />
            
            <p>{{(ArticleTitle + " " + ArticleText)}}</p>

            <button>Post</button>

            <div v-if="error">{{ error }}</div>
        </form>
        </div>
        <hr noshade>
        <h3>Published Articles:</h3>
        <ArticleList />
</template>

<script>

import { articleService } from "../services/article.service"
import { userService } from "../services/user.service"
import ArticleList from "./ArticleList.vue"

    export default{
        components: {
            ArticleList
        },
        data(){
            return{
                ArticleTitle:"",
                Author: "",
                ArticleText: "",
                submitted: false
            }
        },
        methods:{
            handleSubmit(e){
                console.log("help")
                this.submitted = true
                this.error = ""
                const {ArticleTitle, Author, ArticleText} = this

                if(!(ArticleTitle && Author && ArticleText)){
                    return;
                }

                articleService.postArticle(ArticleTitle, Author, ArticleText)
                .then(result => {
                    console.log("Posted Article")
                    
                    this.$router.push("/Dashboard")
                    this.$router.go();
                })
                .catch(error => {
                    this.error = error;
                    this.loading = false;
                })
            },
            logout(){
                userService.logOut()
                .then(result => {
                    this.$router.push("/")})
                
            }
        }
    }
</script>