<script>
import { supabase } from '@/supabase';
export default {
  name: 'SignupPage',
  data() {
    return {
      isLoading: false,
      form: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      message: {
        text: '',
        type: '', // 'success' o 'danger'
        icon: '' // es. 'check-circle' o 'exclamation-triangle'
      }
    }
  },
  computed: {
    passwordsMatch() {
      return this.form.password === this.form.confirmPassword
    }
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
        .single();

        if (error || !data) {
        throw new Error('Credenziali non valide');
        }

        this.showMessage('Accesso effettuato con successo!', 'success', 'check-circle');

        // Salva user id se vuoi
        localStorage.setItem('userId', data.id);

        // Redirect
        this.$router.push('/dashboard');
    } catch (error) {
        this.showMessage(error.message || 'Errore durante l\'accesso', 'danger', 'exclamation-triangle');
    } finally {
        this.isLoading = false;
    }
    },
    resetMessage() {
      this.message = {
        text: '',
        type: '',
        icon: ''
      }
    },
    showMessage(text, type, icon) {
      this.message = { text, type, icon }
    }
  }
}
</script>

<template>
  <div class="signup-page">
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body">
              <h2 class="card-title text-center mb-4">
                <font-awesome-icon icon="user-plus" class="me-2" />
                Registrazione
              </h2>

              <form @submit.prevent="handleSubmit">
                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <font-awesome-icon icon="envelope" />
                    </span>
                    <input
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      required
                      placeholder="esempio@email.com"
                    />
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <font-awesome-icon icon="lock" />
                    </span>
                    <input
                      v-model="form.password"
                      type="password"
                      class="form-control"
                      required
                      minlength="6"
                      placeholder="Minimo 6 caratteri"
                    />
                  </div>
                </div>

                <!-- Conferma Password -->
                <div class="mb-4">
                  <label for="confirmPassword" class="form-label">Conferma Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <font-awesome-icon icon="lock" />
                    </span>
                    <input
                      v-model="form.confirmPassword"
                      type="password"
                      class="form-control"
                      required
                      placeholder="Ripeti la password"
                    />
                  </div>
                  <small v-if="!passwordsMatch" class="text-danger">
                    Le password non coincidono
                  </small>
                </div>

                <!-- Pulsante Submit -->
                <button 
                  type="submit" 
                  class="btn btn-primary w-100"
                  :disabled="isLoading || !passwordsMatch"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  <span v-else><font-awesome-icon icon="user-plus" class="me-2" /></span>
                  Registrati
                </button>

                <!-- Link a Login -->
                <div class="text-center mt-3">
                  <router-link to="/login" class="text-decoration-none">
                    <font-awesome-icon icon="sign-in-alt" class="me-1" />
                    Hai già un account? Accedi
                  </router-link>
                </div>
              </form>
            </div>
          </div>

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
</template>

<style lang="scss"scoped>
.signup-page {
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