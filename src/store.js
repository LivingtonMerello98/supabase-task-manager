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
      const user = supabase.auth.getUser(); // o await supabase.auth.getUser() se async

      // Se la funzione è async:
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        throw new Error('Utente non autenticato');
      }

      const userId = currentUser.id;

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
        .eq('owner_id', userId)
        .order('id', { ascending: false });

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
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        throw new Error('Utente non autenticato');
      }

      const userId = currentUser.id;

      const { error } = await supabase
        .from('task')
        .delete()
        .eq('id', id)
        .eq('owner_id', userId);

      if (error) throw error;

      // Aggiorna la lista solo se cancellato correttamente
      this.tasks = this.tasks.filter(task => task.id !== id);

    } catch (err) {
      this.error = 'Errore nella cancellazione della task: ' + err.message;
    }
  },

  async fetchCompanies() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        throw new Error('Utente non autenticato');
      }

      const userId = currentUser.id;

      const { data, error } = await supabase
        .from('company')
        .select('id, name_company')
        .eq('owner_id', userId);

      if (error) throw error;
      this.companies = data;
    } catch (err) {
      this.error = 'Errore nel caricamento delle aziende: ' + err.message;
    }
  },

  async addTask(task) {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) throw new Error('Utente non autenticato');

        const newTask = {
          name: task.name,
          description: task.description,
          state_id: task.state_id,
          company_id: task.company_id,
          owner_id: currentUser.id
        };

        const { error } = await supabase.from('task').insert([newTask]);
        if (error) throw error;

        await this.fetchTasks();
      } catch (err) {
        this.error = 'Errore nell\'aggiunta della task: ' + err.message;
      }
  },


  setTaskFilter(filter) {
    this.taskFilter = filter.toLowerCase();
  },

})
