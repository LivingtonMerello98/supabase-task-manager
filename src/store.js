// store.js
//libreria per compiere chiamate http
import axios from 'axios';
import { reactive } from 'vue';
import { supabase } from '@/supabase';

export const taskStore  = reactive({

  //variabili
  tasks: [],
  loading: false,
  error: null,
  taskFilter: '',  

  //funz recupero task
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
        `)
        .order('id', { descending: true });

      if (error) throw error;
      this.tasks = data;
    } catch (err) {
      this.error = 'Errore nel caricamento delle task: ' + err.message;
    } finally {
      this.loading = false;
    }
  },

  //funz cancella task
  async deleteTask(id) {
    const { error } = await supabase.from('task').delete().eq('id', id);
    if (!error) {
      this.tasks = this.tasks.filter(task => task.id !== id);
    }
  },

  async fetchCompanies() {
    try {
      const { data, error } = await supabase
        .from('company')
        .select('id, name_company');

      if (error) throw error;
      this.companies = data;
    } catch (err) {
      this.error = 'Errore nel caricamento delle aziende: ' + err.message;
    }
  },

  setTaskFilter(filter) {
    this.taskFilter = filter.toLowerCase();
  },

})
