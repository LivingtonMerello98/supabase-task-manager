<script>
import ChatBot from './components/ChatBot.vue';
export default {
  name: 'App',
  components: {
    ChatBot
  },
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
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        this.messages.push({ text: this.newMessage, fromUser: true });
        this.newMessage = '';
        setTimeout(() => {
          this.messages.push({ text: 'Risposta automatica', fromUser: false });
        }, 500);
      }
    }
  }
};
</script>

<template>
  <section class="section">
    <router-view />
  </section>
</template>

<style lang="scss" scoped>
@use 'src/assets/partials/mixin' as *;
@use 'src/assets/partials/variables' as *;

.section {
  background-color: $custom-primary-color;
  position: relative;
  min-height: 100vh;
  padding-bottom: 3rem; 
}
</style>
