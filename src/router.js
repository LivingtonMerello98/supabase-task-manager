import { createRouter, createWebHistory } from 'vue-router'

import SignupPage from '@/pages/SignupPage.vue'
import LoginPage from '@/pages/LoginPage.vue';
import Dashboard from './components/Dashboard.vue';
import TaskList from './components/TaskList.vue'; // importa il componente task list

const routes = [
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/signup', name: 'Signup', component: SignupPage },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        beforeEnter: (to, from, next) => {
            const loggedIn = localStorage.getItem('userLoggedIn');
            if (loggedIn === 'true') {
                next();
            } else {
                next('/login');
            }
        }
    },
    {
        path: '/tasks',
        name: 'Tasks',
        component: TaskList,
        beforeEnter: (to, from, next) => {
            const loggedIn = localStorage.getItem('userLoggedIn');
            if (loggedIn === 'true') {
                next();
            } else {
                next('/login');
            }
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
