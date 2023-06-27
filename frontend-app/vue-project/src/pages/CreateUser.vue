<template>
    <nav class = "Navicontainer">
        <button><router-link to="/Dashboard">Dashboard</router-link></button>
        <button><router-link to="/users">Users</router-link></button>
        <button v-on:click="logout">Logout</button>
    </nav>

    <hr noshade>
    <div class="Welcome">
        <div>
            <img src="../pompom.png" alt="Doggy" style="width:150px;height:150px;">
        </div>
        <div>
            <h1>⋆｡°✩Create a new User✩°｡⋆</h1>
        </div>
        <div>
            <img src="../pompom.png" alt="Doggy" style="width:150px;height:150px;">
        </div>
    </div>

    <hr noshade>

<form @submit.prevent="handleSubmit">
            <label class = "label" for = "firstName">First Name: </label>
            <br>
            <br>
            <input class = "input" type="firstName" name="firstName" v-model="firstName"/>
            <div class = "label" v-show="submitted && !firstName">First Name is required</div>

            <br/><br/>

            <label class = "label" for="lastName"> Last Name: </label>
            <br>
            <br>
            <input class = "input" type="lastName" name="lastName" v-model="lastName"/>
            <div class = "label" v-show="submitted && !lastName">Last Name is required</div>

            <br/><br/>

            <label class = "label" for = "email">Email: </label>
            <br>
            <br>
            <input class = "input" type="email" name="email" v-model="email"/>
            <div class = "label" v-show="submitted && !email">Email is required</div>

            <br/><br/>

            <label class = "label" for="password"> Password: </label>
            <br>
            <br>
            <input class = "input" type="password" name="password" v-model="password"/>
            <div class = "label" v-show="submitted && !password">Password is required</div>

            <br /><br />
            <p>{{email + " " + password}}</p>

            <button>Create User</button>
            <div v-if="error">{{ error }}</div>
</form>
</template>

<script>
    import { userService } from "../services/user.service"
import * as EmailValidator from 'email-validator';

    export default{
        data(){
            return{
                firstName:"",
                lastName:"",
                email:"",
                password: "",
                submitted: false
            }
        },
        methods:{
            handleSubmit(e){
                this.submitted = true
                this.error = ""
                const {firstName, lastName, email, password} = this

                if(!(email && password && firstName && lastName)){
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
                userService.createUser(firstName, lastName, email,password)
                .then(result => {
                    console.log("Auth - go to dash")
                    this.$router.push("/dashboard")
                })
                .catch(error => {
                    this.error = error;
                    this.loading = false;
                })
            }
        }
    }

    
</script>