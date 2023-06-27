<template>

    <div class="Navicontainer">
        <button><router-link to="/login">Login</router-link></button>
    </div>

    <hr noshade>
    <div class="Welcome">
        <div>
            <img src="../rabbit.png" alt="Rabbit" style="width:200px;height:200px;">
        </div>
        <div>
            <h1>⋆｡°✩Welcome to Spacebook✩°｡⋆</h1>
            <h2>The next generation of social networking</h2> 
        </div>
        <div>
            <img src="../rabbit.png" alt="Rabbit" style="width:200px;height:200px;">
        </div>
    </div>
    
    <br>
    <hr noshade>
    <br>

    <h3>Published Articles:</h3>
    <p>New articles will appear in the colour <span style="color:#D88C9A">pink!</span></p>
    <ArticleList />
</template>

<script>
    import ArticleList from "./ArticleList.vue"

    export default{
        components:{
            ArticleList
        }
    }
</script>

<style>
    @import '../style.css';
</style>