<script>
//task.vue
import { taskStore } from '@/store';
import { supabase } from '@/supabase';

export default {
  props: {
    taskId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      editing: false,
      editedTask: {
        name: '',
        description: '',
        state_id: ''
      },
      states: []
    };
  },
  computed: {
    task() {
      return taskStore.tasks.find(t => t.id === this.taskId);
    }
  },
  async mounted() {
    const { data } = await supabase.from('state').select('id, description_state');
    this.states = data || [];
  },
  methods: {
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    },
    startEditing() {
      this.editing = true;
      this.editedTask = {
        name: this.task.name,
        description: this.task.description,
        state_id: this.task.state_id
      };
    },
    async saveTask() {
      const { error } = await supabase
        .from('task')
        .update(this.editedTask)
        .eq('id', this.task.id);

      if (!error) {
        this.editing = false;
        await taskStore.fetchTasks();
      } else {
        alert('Errore nel salvataggio');
      }
    },
    async deleteTask() {
      const confirmDelete = confirm('Sei sicuro di voler eliminare questa task?');
      if (!confirmDelete) return;
      await taskStore.deleteTask(this.task.id);
    }
  }
};
</script>

<template>
  <tr v-if="task" class="record-row">
    <td>
      <input v-if="editing" v-model="editedTask.name" class="form-control" />
      <span v-else>{{ task.name }}</span>
    </td>
    <td>
      <input v-if="editing" v-model="editedTask.description" class="form-control" />
      <span v-else>{{ task.description }}</span>
    </td>
    <td>
      <select v-if="editing" v-model="editedTask.state_id" class="form-select">
        <option v-for="state in states" :key="state.id" :value="state.id">
          {{ state.description_state }}
        </option>
      </select>
      <span v-else>{{ task.state.description_state }}</span>
    </td>
    <td>{{ task.company.name_company }}</td>
    <td>{{ task.time }}</td>
    <td>
      <div v-if="editing">
        <button @click="saveTask" class="btn btn-sm btn-success me-2">Salva</button>
        <button @click="editing = false" class="btn btn-sm btn-secondary">Annulla</button>
      </div>
      <div v-else>
        <button @click="startEditing" class="btn btn-sm btn-warning me-2">Modifica</button>
        <button @click="deleteTask" class="btn btn-sm btn-danger">Elimina</button>
      </div>
    </td>
  </tr>
</template>

<style lang="scss"scoped>
@use 'src/assets/partials/mixin' as*;
@use 'src/assets/partials/variables' as*;

.record-row {
  background-color: $custom-secondary-color;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-radius: 10px;
  transition: box-shadow 0.3s ease;
}

.record-row:hover {
  box-shadow: 0 4px 15px rgba(0,0,0,0.12);
}

.record-row td {
  padding: 15px 20px;
  vertical-align: middle;
}
</style>
