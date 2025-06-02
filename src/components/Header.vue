<script>
export default {
    name:'header',
    data() {
    return {
    };
    },
    methods: {
        handleLogout() {
        localStorage.removeItem('userLoggedIn');
        this.$router.push('/');
        },
    }
};
</script>

<template>
    <section class="section">
        <div class="container-fluid py-2">
            <button @click="handleLogout" class="btn btn-danger">Logout</button>
        </div>
    </section>
</template>

<style lang="scss"scoped>
@use 'src/assets/partials/mixin' as*;
@use 'src/assets/partials/variables' as*;


.section{
    border-bottom:  1px solid $custom-icon-color;
    background-color: $custom-secondary-color;
}

</style>