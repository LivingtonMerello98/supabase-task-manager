<script>
//singup page
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

              <form @submit.prevent="handleSubmit">
                <!-- Email -->
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <font-awesome-icon icon="envelope" />
                    </span>
                    <input
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      required
                    />
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label class="form-label">Password</label>
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
                    />
                  </div>
                </div>

                <!-- Conferma Password -->
                <div class="mb-4">
                  <label class="form-label">Conferma Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <font-awesome-icon icon="lock" />
                    </span>
                    <input
                      v-model="form.confirmPassword"
                      type="password"
                      class="form-control"
                      required
                    />
                  </div>
                  <small v-if="!passwordsMatch" class="text-danger err-pw">
                    Le password non coincidono
                  </small>
                </div>

                <!-- Pulsante Registrati -->
                <div class="col-md-12 d-flex justify-content-center">
                  <button 
                    type="submit" 
                    class="button"
                    :disabled="isLoading || !passwordsMatch"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Registrati
                  </button>
                </div>

                <!-- Link a Login -->
                <div class="text-center mt-5">
                  <router-link to="/login" class="text-decoration-none">
                    <font-awesome-icon icon="sign-in-alt" class="me-1 accedi-link" />
                    <span class="accedi-link">Hai già un account? Accedi</span>
                  </router-link>
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

<style lang="scss" scoped>
@use 'src/assets/partials/mixin' as*;
@use 'src/assets/partials/variables' as*;

.accedi-link{
  font-size: 13px;
  color: $custom-icon-color;
}

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
