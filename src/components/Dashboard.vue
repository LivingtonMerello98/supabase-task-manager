<script>
export default {
    methods: {
    handleLogout() {
        localStorage.removeItem('userLoggedIn');
        this.$router.push('/login');
    }
    }
};
</script>
<template>
  <div class="dashboard container">
    <h1 class="text-white">Benvenuto nella Dashboard</h1>
    <button @click="$router.push('/tasks')" class="btn btn-primary me-2">
      Vai alle Task
    </button>
    <button @click="handleLogout" class="btn btn-danger">Logout</button>
  </div>
</template>


<style scoped>
.dashboard {
  padding-top: 2rem;
}
</style>
