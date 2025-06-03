<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      sidebarItems: ['My Task', 'Manage State', 'Dashboard', 'Email', 'Calendar']
    };
  }
};
</script>

<template>
    <div class="d-flex flex-column mx-3 my-3">
        <div class="action-button">
            <button v-for="(item, index) in sidebarItems" :key="index" class="input-group my-4">
                <span class="icon me-2">
                    <font-awesome-icon icon="plus" class="me-2" />
                </span>
                <span class="button-label">{{ item }}</span>
            </button>
        </div>
    </div>
    <hr class="line">
</template>

<style lang="scss" scoped>
@use 'src/assets/partials/variables' as *;


.line{
  color: $custom-icon-color;
}

.action-button {
  .input-group {
    display: flex;
    align-items: center;
    border: 0px solid $custom-icon-color; 
    border-radius: 2rem; 
    background-color: transparent;
    padding: 0.5rem 1rem;
    transition: border 0.2s ease, box-shadow 0.2s ease;
    color: $custom-icon-color;
    cursor: pointer;

    &:hover {
       box-shadow: 0 0 4px 1px rgba($custom-outline-color, 0.4);
       color: white;
    }

    .icon {
      color: $custom-icon-color;
      font-size: 1rem;
    }
  }
}

</style>
