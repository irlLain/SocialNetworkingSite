<template>
        <nav class="Navicontainer">
            <button><router-link to="/Dashboard">Dashboard</router-link></button>
            <button v-on:click="logout">Logout</button>
        </nav>
        <hr noshade>
    
        <div class="Welcome">
        <div>
            <img src="../kuromi.gif" alt="Bunny" style="width:200px;height:200px;">
        </div>
        <div>
            <h1>⋆｡°✩Display all Users✩°｡⋆</h1> 
        </div>
        <div>
            <img src="../kuromi.gif" alt="Bunny" style="width:200px;height:200px;">
        </div>
    </div>

    <hr noshade>
    
    <h3>All the current users on the database:</h3>
    <em v-if="loading">Loading users...</em>

    <ul v-if="users.length">
        <li v-for="user in users" :key="user.user_id">
                {{ user.first_name + ' ' + user.last_name }}
                <br>
                    <br>
                    <br>
        </li>
    </ul>

    <div v-if="error">
        {{ error }}
    </div>

</template>

<script>
    import {userService } from "../services/user.service"

    export default{
        data(){
            return {
                users: [],
                error: "",
                loading: true
            }
        },
        mounted(){
            userService.getAll()
            .then(users => {
                this.users = users
                this.loading = false
            })
            .catch(error => this.error = error);
        }
    }
</script>