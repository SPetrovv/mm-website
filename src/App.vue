<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/profile-review">Profile Review</router-link>
      <router-link to="/ask-advice">Ask for Advice</router-link>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
