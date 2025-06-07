<script>
export default {
  name: 'ChatBot',
  data() {
    return {
      chatOpen: false,
      newMessage: '',
      messages: []
    };
  },
    methods: {
        toggleChat() {
            this.chatOpen = !this.chatOpen;
        },
        async sendMessage() {
            if (this.newMessage.trim() === '') return;

            // Messaggio utente
            this.messages.push({ text: this.newMessage, fromUser: true });
            const userMessage = this.newMessage;
            this.newMessage = '';

            try {
            // Chiamata al backend x qunado uso express
            // const response = await fetch('/api/chatbot/', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ message: userMessage }),
            // });

            const response = await fetch('/.netlify/functions/chatbot', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: userMessage }),
            });


            const data = await response.json();

            if (response.ok) {
                this.messages.push({ text: data.reply, fromUser: false });
            } else {
                this.messages.push({ text: 'Errore nella risposta del server', fromUser: false });
            }
            } catch (error) {
            this.messages.push({ text: 'Errore di rete o server', fromUser: false });
            console.error(error);
            }
        }
    }
};
</script>

<template>
  <div class="chat-container" :class="{ open: chatOpen }">
    <div class="chat-header" @click="toggleChat" role="button" :aria-expanded="chatOpen.toString()" tabindex="0">
      AI assistant
      <button v-if="chatOpen" class="close-btn" @click.stop="toggleChat" aria-label="Chiudi chat">×</button>
    </div>

    <transition name="slide-up">
      <div v-if="chatOpen" class="chat-body-wrapper">
        <div class="chat-body" tabindex="0">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="['message', msg.fromUser ? 'user' : 'bot']"
          >
            {{ msg.text }}
          </div>
        </div>
        <div class="chat-input">
          <input
            type="text"
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Scrivi un messaggio..."
            aria-label="Scrivi un messaggio"
          />
          <button @click="sendMessage">Invia</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@use 'src/assets/partials/mixin' as *;
@use 'src/assets/partials/variables' as *;

.chat-container {
  position: fixed;
  bottom: 0;
  right: 20px;
  width: 400px;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  font-family: Arial, sans-serif;
  background: #2b2b2b;
  color: white;
  user-select: none;

  height: 2.5rem;
  transition: height 0.3s ease;
  
  &.open {
    height: 350px;
  }
}
.chat-container.open {
  height: 350px;
}

.chat-header {
  height: 2.5rem;
  line-height: 2.5rem;
  background-color: $custom-secondary-color;
  font-weight: bold;
  padding: 0 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.15);
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
}

.chat-body-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(350px - 2.5rem);
  background: #2b2b2b;
  overflow: hidden;
}

.chat-body {
  flex: 1;
  padding: 0.5rem;
  overflow-y: auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}

.message {
  margin: 0.3rem 0;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  min-width: 30%;
  max-width: 80%;
  word-wrap: break-word;
  color: white;
  display: inline-block;
}

.user {
  background-color:$custom-secondary-color;
  margin-left: auto;  /* sposta a destra */
  text-align: left;
  padding-left: 1rem;
}

.bot {
  background-color: #555;
  margin-right: auto; /* sposta a sinistra */
  text-align: left;
  padding-left: 1rem;
}


.chat-input {
  display: flex;
  border-top: 1px solid #444;
  padding: 0.5rem;
  background-color: #2b2b2b;
}

.chat-input input {
  flex: 1;
  border: none;
  background: #1e1e1e;
  color: white;
  padding: 0.4rem;
  border-radius: 4px;
  margin-right: 0.5rem;
}

.chat-input button {
  background-color: #28a745;
  border: none;
  padding: 0.4rem 0.8rem;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

</style>
