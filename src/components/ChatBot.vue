<script>
export default {
  name: 'ChatBot',
  data() {
    return {
      chatOpen: false,
      newMessage: '',
      messages: [],
      botTyping: false
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
            this.botTyping = true;
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
            } finally{
              this.botTyping = false; 
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
        <div v-if="botTyping" class="message typing-animation">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
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
          <button @click="sendMessage">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path d="M7.99992 14.9993V5.41334L4.70696 8.70631C4.31643 9.09683 3.68342 9.09683 3.29289 8.70631C2.90237 8.31578 2.90237 7.68277 3.29289 7.29225L8.29289 2.29225L8.36906 2.22389C8.76184 1.90354 9.34084 1.92613 9.70696 2.29225L14.707 7.29225L14.7753 7.36842C15.0957 7.76119 15.0731 8.34019 14.707 8.70631C14.3408 9.07242 13.7618 9.09502 13.3691 8.77467L13.2929 8.70631L9.99992 5.41334V14.9993C9.99992 15.5516 9.55221 15.9993 8.99992 15.9993C8.44764 15.9993 7.99993 15.5516 7.99992 14.9993Z" fill="currentColor"></path></svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@use 'src/assets/partials/mixin' as *;
@use 'src/assets/partials/variables' as *;


.typing-animation {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: flex-start;
  height: 24px;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: white;
  margin: 0px 2px 0px;
  border-radius: 50%;
  display: inline-block;
  animation: typingBounce 1.2s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.3;
  }
  40% {
    transform: scale(1.4);
    opacity: 1;
  }
}



.chat-container {
  position: fixed;
  bottom: 0;
  right: 32px;
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
  margin: 0.5rem 0;
  padding: 0.7rem 0.6rem;
  border-radius: 8px;
  min-width: 30%;
  max-width: 80%;
  word-wrap: break-word;
  color: white;
  display: inline-block;
}

.user {
  background-color: $custom-secondary-color;
  margin-left: auto;
  text-align: left;
  padding-left: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  position: relative;
  max-width: 70%;

  &::after {
    content: '';
    position: absolute;
    bottom: 6px;
    right: -4px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-left-color: $custom-secondary-color;
    border-right: 0;
    margin-top: -6px;
  }
}

.bot {
  background-color: #555;
  margin-right: auto;
  text-align: left;
  padding-left: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  position: relative;
  max-width: 70%;

  &::after {
    content: '';
    position: absolute;
    bottom: 6px;
    left: -4px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-right-color: #555;
    border-left: 0;
    margin-top: -6px;
  }
}


.chat-input {
  display: flex;
  border-top: 1px solid $custom-icon-color;
  padding: 0.5rem;
  background-color: #2b2b2b;
}

.chat-input input {
  @include chat-input-style;
  flex: 1;
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
