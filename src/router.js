import { createRouter, createWebHistory } from 'vue-router'

import SignupPage from '@/pages/SignupPage.vue'
import LoginPage from '@/pages/LoginPage.vue';
import Main from './components/Main.vue';

const routes = [
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/signup', name: 'Signup', component: SignupPage },
    {
        path: '/main/tasks',
        name: 'Main',
        component: Main,
        beforeEnter: (to, from, next) => {
            const loggedIn = localStorage.getItem('userLoggedIn');
            if (loggedIn === 'true') {
                next();
            } else {
                next('/');
            }
        }
    },
    // {
    //     path: '/tasks',
    //     name: 'Tasks',
    //     component: TaskList,
    //     beforeEnter: (to, from, next) => {
    //         const loggedIn = localStorage.getItem('userLoggedIn');
    //         if (loggedIn === 'true') {
    //             next();
    //         } else {
    //             next('/login');
    //         }
    //     }
    // }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
