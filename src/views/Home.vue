<template>
  <div class="container">
    <h1>Date Coaching</h1>
    <div class="card">
      <h2>Level Up Your Dating Life ❤️</h2>
      <p style="text-align: center;">
        Get expert help to improve your Tinder / Instagram profile or ask
        for personalized dating advice.
      </p>
      <div class="button-group">
        <router-link to="/profile-review">
          <button>Improve My Profile</button>
        </router-link>
        <router-link to="/ask-advice">
          <button>Ask for Advice</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
