<script>
import { supabase } from '@/supabase';

export default {
  data() {
    return {
      tasks: [],
      loading: false,
      error: null,
      editingTaskId: null,
      editedTask: {
        name: '',
        description: '',
        state_id: ''
      },
      states: [] // stato per dropdown
    };
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('userLoggedIn');
      this.$router.push('/login');
    },

    async fetchStates() {
      const { data, error } = await supabase.from('state').select('id, description_state');
      if (!error) this.states = data;
    },

    async fetchTasks() {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await supabase
          .from('task')
          .select(`
            id,
            name,
            description,
            time,
            state_id,
            state:state_id (
              description_state
            ),
            company:company_id (
              name_company
            )
          `).order('id', { descending: true });;

        if (error) throw error;
        this.tasks = data;
      } catch (err) {
        this.error = 'Errore nel caricamento delle task: ' + err.message;
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    },

    startEditing(task) {
      this.editingTaskId = task.id;
      this.editedTask = {
        name: task.name,
        description: task.description,
        state_id: task.state_id
      };
    },

    async saveTask(id) {
      const { error } = await supabase
        .from('task')
        .update({
          name: this.editedTask.name,
          description: this.editedTask.description,
          state_id: this.editedTask.state_id
        })
        .eq('id', id);

      if (error) {
        alert('Errore nel salvataggio');
      } else {
        this.editingTaskId = null;
        this.fetchTasks();
      }
    },

    async deleteTask(id) {
      const confirmDelete = confirm('Sei sicuro di voler eliminare questa task?');
      if (!confirmDelete) return;

      const { error } = await supabase.from('task').delete().eq('id', id);
      if (!error) this.fetchTasks();
    }
  },
  mounted() {
    this.fetchStates();
    this.fetchTasks();
  }
};
</script>

<template>
  <div class="task-list container-fluid mt-4">
    <button @click="handleLogout" class="btn btn-danger mb-3">Logout</button>
    <h2>Elenco Task</h2>
    <div class="table-scroll-wrapper">
      <table class="custom-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrizione</th>
            <th>Stato</th>
            <th>Azienda</th>
            <th>Data</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="task in tasks"
            :key="task.id"
            class="record-row"
          >
            <td>
              <input
                v-if="editingTaskId === task.id"
                v-model="editedTask.name"
                class="form-control"
              />
              <span v-else>{{ task.name }}</span>
            </td>
            <td>
              <input
                v-if="editingTaskId === task.id"
                v-model="editedTask.description"
                class="form-control"
              />
              <span v-else>{{ task.description }}</span>
            </td>
            <td>
              <select
                v-if="editingTaskId === task.id"
                v-model="editedTask.state_id"
                class="form-select"
              >
                <option
                  v-for="state in states"
                  :key="state.id"
                  :value="state.id"
                >
                  {{ state.description_state }}
                </option>
              </select>
              <span v-else>{{ task.state.description_state }}</span>
            </td>
            <td>{{ task.company.name_company }}</td>
            <td>{{ formatDate(task.time) }}</td>
            <td>
              <div v-if="editingTaskId === task.id">
                <button @click="saveTask(task.id)" class="btn btn-sm btn-success me-2">Salva</button>
                <button @click="editingTaskId = null" class="btn btn-sm btn-secondary">Annulla</button>
              </div>
              <div v-else>
                <button @click="startEditing(task)" class="btn btn-sm btn-warning me-2">Modifica</button>
                <button @click="deleteTask(task.id)" class="btn btn-sm btn-danger">Elimina</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="loading" class="text-center mt-3">
      <span class="spinner-border" role="status"></span>
    </div>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  </div>
</template>

<style scoped>
/* Manteniamo gli stili esistenti e aggiungiamo padding e margini per i bottoni */
.task-list {
  padding-top: 0.5rem;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 1rem;
}

.record-row {
  background: #fefefe;
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

.table-scroll-wrapper {
  max-height: 700px;
  overflow-y: auto;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  background-color: #fff;
}
</style>
