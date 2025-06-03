<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      sidebarItems: [
        { label: 'My Task', icon: '/task.svg' },
        { label: 'Manage State', icon: '/state.svg' },
        { label: 'Dashboard', icon: '/dashboard.svg' },
        { label: 'Email', icon: '/email.svg' },
        { label: 'Calendar', icon: '/calendar.svg' }
      ]
    };
  }
};
</script>

<template>
  <div class="d-flex flex-column mx-3 sidebar-content">
    <div class="action-button" v-for="(item, index) in sidebarItems" :key="index">
      <button class="input-group my-4">
        <span class="icon me-3">
          <img :src="item.icon" alt="icon" class="svg-icon" />
        </span>
        <span class="button-label">{{ item.label }}</span>
      </button>
    </div>
  </div>
  <hr class="line" />
</template>

<style lang="scss" scoped>
@use 'src/assets/partials/variables' as *;

.line {
  color: $custom-icon-color;
}

.sidebar-content {
  margin-top: 2rem;
}

.action-button {
  .input-group {
    display: flex;
    align-items: center;
    border: 0;
    border-radius: 2rem;
    background-color: transparent;
    padding: 0.5rem 1rem;
    transition: border 0.2s ease, box-shadow 0.2s ease;
    color: $custom-icon-color;
    cursor: pointer;

    &:hover {
      transition: 0.2s ease;
      box-shadow: 0 0 4px 1px rgba($custom-outline-color, 0.4);
      color: white;
    }

    .icon {
      display: flex;
      align-items: center;
    }

    .svg-icon {
      width: 1.8rem;
      height: auto;
      //filter: invert(90%); // adatta in base al colore tema
    }

    .button-label {
      color: $custom-icon-color;
      font-size: 16px;
    }
  }
}
</style>
