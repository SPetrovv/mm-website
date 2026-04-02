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
        :disabled="submitting || !topic || !title || !message || !email"
      >
        {{ submitting ? 'Redirecting...' : 'Send' }}
      </button>
    </div>
  </div>
</template>

<script>
import { createStripeCheckoutSession } from '../lib/createStripeCheckoutSession'

export default {
  name: 'AskAdvice',
  data() {
    return {
      topic: '',
      title: '',
      message: '',
      email: '',
      submitting: false
    }
  },
  methods: {
    async sendAdvice() {
      if (!this.topic || !this.title || !this.message || !this.email) {
        alert('Please fill in all fields')
        return
      }

      try {
        this.submitting = true

        const pending = {
          service: 'ask_advice',
          topic: this.topic,
          title: this.title,
          message: this.message,
          email: this.email
        }

        localStorage.setItem('mm_stripe_pending', JSON.stringify(pending))

        const data = await createStripeCheckoutSession({ service: 'ask_advice' })
        window.location.assign(data.url)
      } catch (error) {
        console.error('Stripe checkout error:', error)
        localStorage.removeItem('mm_stripe_pending')
        alert(error?.message || 'Stripe checkout failed. Please try again.')
        this.submitting = false
      }
    }
  },
}
</script>
