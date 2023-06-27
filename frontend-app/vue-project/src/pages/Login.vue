<template>

    <div class="Navicontainer">
        <button><router-link to="/">Home</router-link></button>
    </div>

    <hr noshade>
    <div class="Welcome">
        <div>
            <img src="../hellokitty.gif" alt="Kitty" style="width:200px;height:150px;">
        </div>
        <div>
            <h1>⋆｡°✩Login✩°｡⋆</h1>
            <h2>The next generation of social networking</h2> 
        </div>
        <div>
            <img src="../hellokitty.gif" alt="Kitty" style="width:200px;height:150px;">
        </div>
    </div>
    <hr noshade>

    <div class ="login">
        <form @submit.prevent="handleSubmit">
            <br>
            <label class = "label" for = "email">Email: </label>
            <br>
            <br>
            <input class = "input" type="email" name="email" v-model="email"/>
            <div class="label" v-show="submitted && !email">Email is required</div>

            <br/><br/>

            <label class = "label" for="password"> Password: </label>
            <br>
            <br>
            <input class = "input" type="password" name="password" v-model="password"/>
            <div class= "label" v-show="submitted && !password">Password is required</div>

            <br /><br />

            <button>Login</button>
            <p></p>
            <div class = "label" v-if="error">{{ error }}</div>
        </form>
    </div>

</template>

<script>

import { userService } from "../services/user.service"
import * as EmailValidator from 'email-validator';

    export default{
        data(){
            return{
                email:"",
                password: "",
                error: "",
                submitted: false
            }
        },
        methods:{
            handleSubmit(e){
                this.submitted = true
                this.error = ""
                const {email, password} = this

                if(!(email && password)){
                    return;
                }

                if(!(EmailValidator.validate(email))){
                    this.error = "Email must be a valid email."
                    return;
                }

                const password_pattern = /^(?=(.*[a-z]))(?=(.*[A-Z]))(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
                if(!(password_pattern.test(password))){
                    this.error = "Password not strong enough."
                    return;
                }

                userService.login(email,password)
                .then(result => {
                    console.log("Auth - go to dash")
                    this.$router.push("/dashboard")
                })
                .catch(error => {
                    if(error=="Bad Request"){
                        this.error="Incorrect Password!"
                    }else{
                        this.error = error;
                    }
                    this.loading = false;
                })
            }
        },
    }
</script>