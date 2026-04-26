<template>
  <div class="container form-page">
    <h2>Payment canceled</h2>
    <div class="card">
      <p>Your payment was canceled. You can try again whenever you are ready.</p>
      <div class="button-group">
        <router-link to="/ai-photo">
          <button>AI Photo</button>
        </router-link>
        <router-link to="/ask-advice">
          <button>Ask for Advice</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
const STORAGE_KEY = 'mm_stripe_pending'

export default {
  name: 'StripeCancel',
  mounted() {
    localStorage.removeItem(STORAGE_KEY)
  }
}
</script>

