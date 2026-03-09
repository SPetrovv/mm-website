<template>
  <div class="container">
    <h1>Date Coaching</h1>
    <div class="card home-card">
      <div class="hero-photos">
        <img
          :src="confidentCityGentleman"
          alt="Confident city gentleman in navy shirt"
          class="hero-photo"
        />
        <img
          :src="warmlyConfidentProfessional"
          alt="Warm, confident professional in a café"
          class="hero-photo"
        />
      </div>
      <div class="hero-copy">
        <h2>Your profile, finally working for you.</h2>
        <p>
          We turn awkward photos and ghosted chats into a profile and messages
          that actually get replies. No cringe scripts. No fake persona. Just
          honest, modern dating help that fits who you are.
        </p>
        <p>
          One place for:
          <br />
          <b>✓ Scroll-stopping AI dating photos</b>
          <br />
          <b>✓ Straightforward, personalized dating advice</b>
        </p>
      </div>
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
import confidentCityGentleman from "../images/confident_city_gentleman_in_navy_shirt.png";
import warmlyConfidentProfessional from "../images/warmly_confident_professional_in_urban_cafý.png";

export default {
  name: "Home",
  data() {
    return {
      confidentCityGentleman,
      warmlyConfidentProfessional,
    };
  },
};
</script>
