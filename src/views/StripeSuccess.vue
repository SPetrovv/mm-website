<template>
  <div class="container form-page">
    <h2>Payment successful</h2>
    <div class="card">
      <p v-if="status === 'loading'">Sending your request...</p>
      <p v-else-if="status === 'success'">Done. Check your email soon.</p>
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
import emailjs from '@emailjs/browser'

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

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      if (!serviceId || !publicKey) {
        this.status = 'error'
        this.errorMessage = 'Missing EmailJS configuration.'
        return
      }

      emailjs.init(publicKey)

      const service = pending?.service || getQueryParam('service')
      try {
        if (service === 'ask_advice') {
          const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ASK_ADVICE_ID
          if (!templateId) throw new Error('Missing ask advice EmailJS template.')

          const templateParams = {
            topic: pending.topic,
            name: pending.title,
            from_email: pending.email,
            message: pending.message
          }

          await emailjs.send(serviceId, templateId, templateParams, publicKey)
        } else if (service === 'profile_review') {
          const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_PROFILE_REVIEW_ID
          if (!templateId) throw new Error('Missing profile review EmailJS template.')

          const templateParams = {
            message: `User uploaded ${pending.fileCount} photo(s) for profile review.\nPhoto URL: ${pending.photoUrl}`,
            from_email: pending.email,
            file_count: pending.fileCount,
            image_url: pending.photoUrl
          }

          await emailjs.send(serviceId, templateId, templateParams, publicKey)
        } else {
          throw new Error('Unknown payment service.')
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

