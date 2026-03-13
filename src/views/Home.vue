<template>
  <div class="container">
    <h1>Date Coaching</h1>
    <div class="home-hero">
      <div class="hero-photos">
        <img
          :src="confidentCityGentleman"
          alt="Confident city gentleman in navy shirt"
          class="hero-photo"
        />
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
        <img
          :src="warmlyConfidentProfessional"
          alt="Warm, confident professional in a café"
          class="hero-photo"
        />
      </div>

      <section class="services-section">
        <h2 class="services-title">Our Services</h2>
        <div class="services-hero">
          <img
            :src="dateImage"
            alt="Date coaching hero"
            class="services-hero-img"
          />
        </div>
        <div class="services-cards">
          <div class="service-card">
            <div class="service-icon">📸</div>
            <h3>Profile Review</h3>
            <p>
              Upload your photos and get honest, practical feedback on how to
              improve your dating profile.
            </p>
            <router-link to="/profile-review">
              <button class="service-more">Improve My Profile</button>
            </router-link>
          </div>
          <div class="service-card">
            <div class="service-icon">💬</div>
            <h3>Ask for Advice</h3>
            <p>
              Share your dating situation or messages and get clear, tailored
              advice on what to do next.
            </p>
            <router-link to="/ask-advice">
              <button class="service-more">Ask for Advice</button>
            </router-link>
          </div>
        </div>
      </section>

      <section class="about-section">
        <p>
          We're not dating "gurus." We're two real people who've been through
          the same dating mess you're probably in right now. Awkward photos.
          Matches that go nowhere. Overthinking every message. Wondering if
          it's you or just the way dating apps work today.
        </p>
        <p>
          We built this because we got tired of bad advice, fake confidence,
          and profiles that don't actually represent who someone is.
        </p>

        <h3>Why we're doing this</h3>
        <p>
          Modern dating is brutally visual and confusing - especially online.
          People don't fail because they're boring or unattractive. They fail
          because:
        </p>
        <ul>
          <li>Their photos don't show them at their best</li>
          <li>They don't know what to say or how to say it</li>
          <li>They're guessing instead of getting real feedback</li>
        </ul>
        <p>
          We wanted to create something simple, honest, and actually useful.
        </p>

        <h3>How we help</h3>
        <p>We offer two focused services - no fluff, no manipulation.</p>
        <ol>
          <li>
            <b>Realistic AI Dating Photos</b>
            <p>
              We generate high-quality, natural-looking AI photos that still
              feel like you. Not fake model shots. Not cringe filters. Just
              clean, confident images that work on Tinder and other dating
              apps.
            </p>
            <p>
              You send us your photos -> we send back AI-generated images
              you'll actually feel comfortable using.
            </p>
          </li>
          <li>
            <b>Dating Questions, Real Answers</b>
            <p>You ask us anything about your dating life:</p>
            <ul>
              <li>What should I change in my profile?</li>
              <li>Why do my conversations die?</li>
              <li>What should I reply to this message?</li>
              <li>Am I doing something wrong?</li>
            </ul>
            <p>
              And it doesn't stop there. We also help with confidence, first
              dates, texting habits, mindset, boundaries, and understanding
              patterns that keep repeating in your dating life.
            </p>
            <p>
              If it affects how you meet, attract, or connect with someone -
              you can ask about it.
            </p>
          </li>
        </ol>

        <h3>How it works</h3>
        <p>
          Everything is simple and private. You send your photos or questions.
          We send your results directly to your email. No public profiles. No
          judgment. Just help.
        </p>

        <p class="about-final">
          <b>
            If you're tired of guessing and ready to actually improve your
            dating results - we're here to help.
          </b>
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import confidentCityGentleman from "../images/confident_city_gentleman_in_navy_shirt.png";
import warmlyConfidentProfessional from "../images/warmly_confident_professional_in_urban_cafý.png";
import dateImage from "../images/date.PNG";

export default {
  name: "Home",
  data() {
    return {
      confidentCityGentleman,
      warmlyConfidentProfessional,
      dateImage,
    };
  },
};
</script>
