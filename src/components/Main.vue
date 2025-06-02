<script>
import Header from './Header.vue';
import TaskList from './TaskList.vue';
import { taskStore } from '@/store';

export default {
  components: { Header, TaskList },
  data() {
    return {
      isHidden: false,
      store: taskStore
    };
  },
  mounted() {
    this.store.fetchCompanies();
    this.store.fetchTasks();
  },
  methods: {
    toggle() {
      this.isHidden = !this.isHidden;
    },
    handleLogout() {
      localStorage.removeItem('userLoggedIn');
      this.$router.push('/');
    },
    setFilter(companyName) {
      this.store.selectedCompany = companyName;
    }
  }
};
</script>

<template>
  <Header />
  <div class="layout">
    <div class="sidebar" :class="{ hidden: isHidden }">
      
    </div>

    <div class="content">
      <button @click="toggle" class="btn btn-secondary toggle-button">
        {{ isHidden ? 'open' : 'X' }}
      </button>

      <!-- Bottoni filtro dinamici parte alta -->
      <div class="button-container py-3">
        <button
          class="btn btn-sm button"
          :class="{ 'active-button': store.selectedCompany === null }"
          :style="{ left: `${0 * 110}px` }"
          @click="setFilter(null)"
        >
          Overview
        </button>

        <button
          v-for="(company, index) in store.companies"
          :key="company.id"
          class="btn btn-sm button text-capitalize"
          :class="{ 'active-button': store.selectedCompany === company.name_company }"
          :style="{ left: `${(index + 1) * 110}px` }"
          @click="setFilter(company.name_company)"
        >
          {{ company.name_company }}
        </button>
      </div>

      <hr class="line">
      <!-- Task list -->
      <TaskList />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'src/assets/partials/mixin' as*;
@use 'src/assets/partials/variables' as*;

.button-container{
  position: relative;

}

.button {
  color:$custom-icon-color;
  position: absolute;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  padding: 0.3rem 0.5rem;
  cursor: pointer;

  &:focus,
  &:active {
    color: white;
    background: transparent;
    outline: none;
    box-shadow: none;
    border-bottom: 1px solid white;

  }
}

.active-button {
  border-bottom: 1px solid white;
  color: white; 
}


.line{
  color: $custom-icon-color;
}

.layout {
  background-color: #121212;
  height: calc(100vh - 55px);
  display: flex;
}

.sidebar {
  background-color: $custom-secondary-color;
  color: white;
  height: 100%;
  width: 300px;
  transition: width 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
}

.sidebar.hidden {
  width: 0;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
}

.sidebar-content {
  padding: 2rem;
}

.content {
  background-color: $custom-primary-color;
  padding: 0.5rem;
  color: white;
  flex-grow: 1;
  transition: all 0.3s ease;
}

.toggle-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>

