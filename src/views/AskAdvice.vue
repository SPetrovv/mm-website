<template>
  <div class="container form-page">
    <h2>Ask for Advice 💬</h2>
    <div class="card">
      <select v-model="topic">
        <option disabled value="">What’s this about?</option>
        <option>Profile & Photos</option>
        <option>Messaging & Texting</option>
        <option>Attraction & Mixed Signals</option>
        <option>First Dates & Real-Life Dating</option>
        <option>Confidence & Mindset</option>
        <option>General Dating Advice / Not Sure</option>
      </select>
      <input 
        v-model="title" 
        placeholder="Title" 
        type="text"
      />
      <input 
        v-model="email" 
        placeholder="Email" 
        type="email"
      />
      <textarea 
        v-model="message" 
        rows="5" 
        placeholder="Describe your situation..."
      ></textarea>
      <button 
        @click="sendAdvice" 
        :disabled="!topic || !title || !message || !email"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script>
import emailjs from '@emailjs/browser'

export default {
  name: 'AskAdvice',
  data() {
    return {
      topic: '',
      title: '',
      message: '',
      email: ''
    }
  },
  methods: {
    async sendAdvice() {
      if (!this.topic || !this.title || !this.message || !this.email) {
        alert('Please fill in all fields')
        return
      }

      const templateParams = {
        topic: this.topic,
        name: this.title,
        from_email: this.email,
        message: this.message
      }

      try {
        // Replace these with your actual EmailJS credentials
        await emailjs.send(
          'service_a24vegm',
          'template_a3lcphf',
          templateParams,
          'r6SOky1Achd_vjYEy'
        )
        alert('Advice request sent!')
        // Reset form
        this.topic = ''
        this.title = ''
        this.message = ''
        this.email = ''
      } catch (error) {
        console.error('Error sending message:', error)
        alert('Error sending message. Please check your EmailJS configuration.')
      }
    }
  },
  mounted() {
    // Initialize EmailJS with your public key
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('r6SOky1Achd_vjYEy')
  }
}
</script>
