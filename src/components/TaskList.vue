<script>
import { taskStore } from '@/store';
import Task from './Task.vue';

export default {
  components: { Task },
  computed: {
    store() {
      return taskStore;
    },
    filteredTasks() {
      if (!this.store.selectedCompany) return this.store.tasks;
      return this.store.tasks.filter(
        task => task.company?.name_company === this.store.selectedCompany
      );
    }
  }
};
</script>


<template>
  <div class="task-list container-fluid mt-4">
    <div class="table-scroll-wrapper">
      <table class="custom-table">
        <tbody>
          <Task v-for="task in filteredTasks" :key="task.id" :taskId="task.id" />
        </tbody>
      </table>
    </div>

    <!-- usa store.loading ed error -->
    <div v-if="store.loading" class="text-center mt-3">
      <span class="spinner-border" role="status"></span>
    </div>
    <div v-if="store.error" class="alert alert-danger mt-3">{{ store.error }}</div>
  </div>
</template>


<style lang="scss" scoped>
@use 'src/assets/partials/mixin' as*;
@use 'src/assets/partials/variables' as*;

.task-list {
  padding-top: 0.5rem;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 1rem;
}

.table-scroll-wrapper{
  max-height: 440px;
  min-height: 440px;
  overflow-y: auto;
  border-radius: 10px;
  padding: 10px;
  background-color: $custom-primary-color;
}
</style>
