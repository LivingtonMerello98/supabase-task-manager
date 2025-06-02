<script>
import { supabase } from '@/supabase';
import { taskStore } from '@/store';

export default {
  props: {
    visible: Boolean
  },
  data() {
    return {
      task: {
        name: '',
        description: '',
        state_id: ''
      },
      states: []
    };
  },
  async mounted() {
    const { data } = await supabase.from('state').select('id, description_state');
    this.states = data || [];
  },
  methods: {
    async addTask() {
      if (!this.task.name || !this.task.state_id) return alert("Name and State are required");
      const { error } = await supabase.from('task').insert([this.task]);
      if (!error) {
        this.$emit('close');
        await taskStore.fetchTasks();
      } else {
        alert("Errore nel salvataggio");
      }
    }
  }
};
</script>


<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content p-4">
      <h5 class="mb-3">Add New Task</h5>
      <input v-model="task.name" class="form-control mb-2" placeholder="Task Name" />
      <input v-model="task.description" class="form-control mb-2" placeholder="Description" />
      <select v-model="task.state_id" class="form-select mb-3">
        <option disabled value="">Select State</option>
        <option v-for="state in states" :key="state.id" :value="state.id">
          {{ state.description_state }}
        </option>
      </select>
      <div class="d-flex justify-content-end">
        <button class="btn btn-sm btn-success me-2" @click="addTask">Save</button>
        <button class="btn btn-sm btn-secondary" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color:#58585872;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background-color: #1e1e1e;
  border-radius: 0.5rem;
  width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  color: white;
}
</style>
