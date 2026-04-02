<template>
  <div class="container form-page">
    <h2>Payment successful</h2>
    <div class="card">
      <p v-if="status === 'loading'">Sending your request...</p>
      <p v-else-if="status === 'success'">Done. We will send you an email in a 24 hours.</p>
      <p v-else-if="status === 'error'">Payment completed, but email sending failed.</p>

      <p v-if="errorMessage">{{ errorMessage }}</p>

      <div class="button-group" v-if="status !== 'loading'">
        <router-link to="/">
          <button>Back to Home</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
const STORAGE_KEY = 'mm_stripe_pending'

function getQueryParam(name) {
  try {
    return new URL(window.location.href).searchParams.get(name)
  } catch {
    return null
  }
}

export default {
  name: 'StripeSuccess',
  data() {
    return {
      status: 'loading', // loading | success | error
      errorMessage: ''
    }
  },
  async mounted() {
    await this.sendPendingEmail()
  },
  methods: {
    async sendPendingEmail() {
      const pendingJson = localStorage.getItem(STORAGE_KEY)
      if (!pendingJson) {
        this.status = 'error'
        this.errorMessage = 'No pending request found. Please submit the form again.'
        return
      }

      let pending
      try {
        pending = JSON.parse(pendingJson)
      } catch {
        this.status = 'error'
        this.errorMessage = 'Saved payment data is corrupted. Please submit the form again.'
        return
      }

      const service = pending?.service || getQueryParam('service')
      try {
        if (service !== 'ask_advice' && service !== 'profile_review') {
          throw new Error('Unknown payment service.')
        }

        const res = await fetch('/.netlify/functions/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service, payload: pending })
        })

        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(text || 'Failed to send email from server.')
        }

        localStorage.removeItem(STORAGE_KEY)
        this.status = 'success'
      } catch (err) {
        console.error('Error sending email after Stripe success:', err)
        this.status = 'error'
        this.errorMessage = err?.message || 'Failed to send email.'
      }
    }
  }
}
</script>

