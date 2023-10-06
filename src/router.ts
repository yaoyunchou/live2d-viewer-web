import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home.vue'
import VueApp from './App.vue';
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: VueApp
    },
    {
        path: '/Home',
        component: Home
    },

    // 其他路由配置...
]

const router = new VueRouter({
    routes
})

export default router
