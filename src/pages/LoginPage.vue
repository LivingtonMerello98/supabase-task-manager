<script>
import { supabase } from '@/supabase';

export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      isLoading: false,
      message: {
        text: '',
        type: '', // success o danger
        icon: ''
      }
    };
  },
  methods: {
    async handleLogin() {
        this.isLoading = true;
        this.resetMessage();

        try {
            const { data, error } = await supabase
            .from('app_user')
            .select('*')
            .eq('username', this.form.email)
            .eq('password', this.form.password) // ⚠️ solo per test, vedi sotto

            if (error) throw error;
            if (!data || data.length === 0) throw new Error('Credenziali non valide');

            // Successo
            this.showMessage(
            'Accesso effettuato con successo!',
            'success',
            'check-circle'
            );

            // (Opzionale) salva user nel localStorage
            localStorage.setItem('user', JSON.stringify(data[0]));
            localStorage.setItem('userLoggedIn', 'true');
            this.$router.push('/dashboard');
        } catch (error) {
            console.error("Login error:", error);
            this.showMessage(
            error.message || 'Errore durante l\'accesso',
            'danger',
            'exclamation-triangle'
            );
        } finally {
            this.isLoading = false;
        }
    },
    resetMessage() {
      this.message = { text: '', type: '', icon: '' };
    },
    showMessage(text, type, icon) {
      this.message = { text, type, icon };
    }
  }
};
</script>

<template>
  <div class="login-page">
    <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-4">
            <div class="card shadow">
              <div class="card-body">
                <h2 class="card-title text-center mb-4">
                  <font-awesome-icon icon="sign-in-alt" class="me-2" />
                  Login
                </h2>
    
                <form @submit.prevent="handleLogin">
                  <!-- Email -->
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <font-awesome-icon icon="envelope" />
                      </span>
                      <input v-model="form.email" type="email" class="form-control" required />
                    </div>
                  </div>
    
                  <!-- Password -->
                  <div class="mb-4">
                    <label class="form-label">Password</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <font-awesome-icon icon="lock" />
                      </span>
                      <input v-model="form.password" type="password" class="form-control" required />
                    </div>
                  </div>
    
                  <!-- Submit Button -->
                  <button 
                    type="submit" 
                    class="btn btn-primary w-100"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <span v-else><font-awesome-icon icon="sign-in-alt" class="me-2" /></span>
                    Accedi
                  </button>
                </form>
    
                <!-- Messaggio di stato -->
                <div 
                  v-if="message.text" 
                  class="alert mt-3"
                  :class="`alert-${message.type}`"
                >
                  <font-awesome-icon :icon="message.icon" class="me-2" />
                  {{ message.text }}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
}
.card {
  border-radius: 10px;
}
.input-group-text {
  width: 40px;
  justify-content: center;
}
</style>
