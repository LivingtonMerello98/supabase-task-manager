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
        type: '', 
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
            .eq('password', this.form.password) 

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
            this.$router.push('/main');
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
  <div class="page">
    <div class="sign">
        <p class="">
          Designed by <span class="fw-semibold fst-italic">Method</span>.
        </p>
    </div>
    <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-4">
            <div class="card shadow">
              <div class="card-body">
                <div class="d-flex justify-content-center mb-4">
                  <img src="/logo-name.svg" alt="logo" class="logo">
                </div>
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
                  <div class="mb-5">
                    <label class="form-label">Password</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <font-awesome-icon icon="lock" />
                      </span>
                      <input v-model="form.password" type="password" class="form-control" required />
                    </div>
                  </div>
    
                  <!-- Submit Button -->
                  <div class="col-md-12 d-flex justify-content-center">
                    <button 
                      type="submit" 
                      class="button"
                      :disabled="isLoading"
                    >
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      <!-- <span v-else><font-awesome-icon icon="sign-in-alt" class="me-2" /></span> -->
                      Accedi
                    </button>
                  </div>
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

<style lang="scss"scoped>
@use 'src/assets/partials/mixin' as*;
@use 'src/assets/partials/variables' as*;

.sign {
  position: absolute;
  color: $custom-icon-color;
  right: 100px;
  bottom: 50px;
  font-size: 12px;
}


.logo{
  width: 100px;
}

.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
}
.card {
  border-radius: 0.5rem;
  background-color: $custom-secondary-color;
  color: $custom-text-white;
  padding:$custom-card-padding;
}

.form-label{
  font-size: 12px;
  color: $custom-label-color ;
}

.input-group-text{
  background-color: $custom-secondary-color;
  color:$custom-icon-color;
  border: 1px solid $custom-border-color;
}

.form-control{
  @include form-control;
}

.button{
  @include btn-primary-to-secondary;
}
</style>
