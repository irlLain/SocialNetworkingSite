import {createRouter, createWebHistory } from 'vue-router';

const ifAuthenticated = (to, from, next) => {
    const loggedIn = localStorage.getItem('session_token');
    if(loggedIn){
        next()
        returb
    }
    next('/login')
}

import Home from "../pages/Home.vue"
import Login from "../pages/Login.vue"
import Article from "../pages/Article.vue"
import Dashboard from "../pages/Dashboard.vue"
import Users from "../pages/Users.vue"
import CreateUser from "../pages/CreateUser.vue"
import Drafts from "../pages/Drafts.vue"

const routes = [
    { path:"/", component: Home},
    { path:"/login", component: Login },
    { path:"/article/:id", component: Article },
    { path:"/Users", component: Users, beforeEnter: ifAuthenticated },
    { path:"/dashboard", component: Dashboard, beforeEnter: ifAuthenticated},
    { path:"/drafts", component: Drafts, beforeEnter: ifAuthenticated},
    { path:"/CreateUser", component: CreateUser, beforeEnter: ifAuthenticated},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})



export default router;