<script>
// signup page
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
        type: '',
        icon: ''
      }
    };
  },
  computed: {
    passwordsMatch() {
      return this.form.password === this.form.confirmPassword;
    }
  },
  methods: {
    async handleSignup() {
      this.isLoading = true;
      this.resetMessage();

      if (!this.passwordsMatch) {
        this.showMessage('Le password non coincidono.', 'danger', 'exclamation-triangle');
        this.isLoading = false;
        return;
      }

      try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: this.form.email,
          password: this.form.password
        });

        if (signUpError) throw signUpError;

        const userId = signUpData?.user?.id;
        const email = this.form.email;
        const plainPassword = this.form.password;

        if (!userId) throw new Error('ID utente non disponibile dopo la registrazione.');

        // Inserimento o aggiornamento in app_user
        const { error: insertError } = await supabase
          .from('app_user')
          .upsert([{
            id: userId,
            username: email,
            password: plainPassword
          }], { onConflict: 'id' });

        if (insertError) {
          this.showMessage('Registrazione riuscita, ma sincronizzazione su app_user non completata.', 'danger', 'exclamation-triangle');
          console.error('Errore insert app_user:', insertError);
        } else {
          this.showMessage('Registrazione completata con successo! Controlla la tua email.', 'success', 'check-circle');
        }
      } catch (error) {
        this.showMessage(error.message || 'Errore durante la registrazione.', 'danger', 'exclamation-triangle');
        console.error('Errore generale:', error);
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

              <form @submit.prevent="handleSignup">
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
                  <router-link to="/" class="text-decoration-none">
                    <font-awesome-icon icon="sign-in-alt" class="me-1 accedi-link" />
                    <span class="accedi-link">Hai già un account? Accedi</span>
                  </router-link>
                </div>
              </form>

              <!-- Messaggio di stato -->
              <div 
                v-if="message.text" 
                class="state-message shadow d-flex justify-content-center align-items-center"
                :class="[message.type, 'visible']"
              >
                <font-awesome-icon :icon="message.icon" class="me-2" :class="message.type" />
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

.icon-success{
  color:$state-todo;
}
.icon-danger{
  color:$state-done;
}


.state-message {
  position: absolute;
  background-color: $custom-secondary-color;
  padding: 1rem 0.9rem;
  top: -190px;
  border-radius: 0.5rem;
  left: 0;
  right: 0;

  /* Effetto fade e slide */
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.state-message.visible {
  opacity: 1;
  transform: translateY(0);
}


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
