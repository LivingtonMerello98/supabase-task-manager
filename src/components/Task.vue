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
    getStateClass(state) {
        switch (state) {
            case 'To Do':
            return 'state-todo';
            case 'On Going':
            return 'state-ongoing';
            case 'Done':
            return 'state-done';
            default:
            return '';
        }
    },
    getCompanyClass(companyName) {
        switch (companyName) {
            case 'ORANGE ID':
            return 'company-orange';
            case 'LUBEX S.P.A':
            return 'company-lubex';
            default:
            return '';
        }
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
  <div v-if="task" class="record d-flex justify-content-between align-items-center">
    <div class="flex-fill px-3">
      <div class="row">
        <div class="col-2 d-flex justify-content-center align-items-center border-right py-2">
          <input v-if="editing" v-model="editedTask.name" class="form-control" />
          <span v-else>{{ task.name }}</span>
        </div>
        <div class="col-3 d-flex align-items-center border-right ">
          <input v-if="editing" v-model="editedTask.description" class="form-control" />
          <span class="description" v-else>{{ task.description.length > 25 ? task.description.slice(0, 25) + '...' : task.description }}</span>
        </div>
        <div class="col-2 d-flex justify-content-center align-items-center border-right">
          {{ task.time }}
        </div>
        <div class="col-2 d-flex justify-content-center align-items-center">
          <select v-if="editing" v-model="editedTask.state_id" class="form-select">
            <option v-for="state in states" :key="state.id" :value="state.id">
              {{ state.description_state }}
            </option>
          </select>
          <span
                v-else
                :class="['state-pill', getStateClass(task.state.description_state)]"
                >
                {{ task.state.description_state }}
          </span>
        </div>
        <div class="col-2 d-flex justify-content-center align-items-center">
            <span
                :class="['company-pill', getCompanyClass(task.company.name_company)]"
            >
                {{ task.company.name_company }}
            </span>
        </div>
      </div>
    </div>
    <div class="px-3">
      <div v-if="editing">
        <button @click="saveTask" class="btn btn-sm btn-success me-2">Salva</button>
        <button @click="editing = false" class="btn btn-sm btn-secondary">Annulla</button>
      </div>
      <div v-else>
        <div class="d-flex align-items-center">
            <div class="d-flex align-items-center">
            <button @click="startEditing" class="btn-edit me-3" type="button">
                <img src="/edit.svg" alt="edit" class="crud" />
            </button>
            <button @click="" class="btn-detail me-3" type="button">
                <img src="/detail.svg" alt="detail" class="crud" />
            </button>
            <button @click="deleteTask" class="btn-remove me-2" type="button">
                <img src="/remove.svg" alt="remove" class="crud" />
            </button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss"scoped>
@use 'src/assets/partials/mixin' as*;
@use 'src/assets/partials/variables' as*;

.form-select{
    @include form-select;
}

.description{
    color: $custom-icon-color;
    font-weight: 400;
}

.record {
  background-color: $custom-primary-color;
  border: 1px solid $custom-icon-color;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
  margin-bottom: 1rem;
}

.record:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
}

.border-right {
  border-right: 1px solid $custom-icon-color; 
}

.form-control{
  @include form-control;
}

.state-pill {
    @include pill
}

.state-todo {
  border-color: $state-todo;
  color: $state-todo;
}

.state-ongoing {
  border-color: $state-ongoing;
  color: $state-ongoing;
}

.state-done {
  border-color: $state-done;
  color: $state-done;
}

.company-pill {
    @include pill
}

.company-orange {
  border-color: $company-orange-id;
  color: $company-orange-id;
}

.company-lubex {
  border-color: $company-lubex;
  color: $company-lubex;
}


.btn-edit,
.btn-remove,
.btn-detail {
  background-color: transparent;
  border: 1px solid;
  border-radius: 1rem;
  width: 50px;  // un po’ più grande per contenere bene l’icona
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-edit {
  border-color: #80FF80;
}

.btn-remove {
  border-color: #FF7375;
}

.btn-detail {
  border-color: #00A6FF;
}

.crud {
  width: 20px;
  height: auto;
}


</style>
