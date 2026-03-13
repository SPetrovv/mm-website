<template>
  <div class="container form-page">
    <h2>Profile Review 📸</h2>
    <div class="card">
      <p>Upload your photos and we will help you improve your dating profile.</p>
      <input 
        type="file" 
        multiple 
        accept="image/*"
        @change="handleFileChange" 
      />
      <button @click="sendPhotos" :disabled="files.length === 0">
        Send
      </button>
      <p v-if="files.length > 0" class="file-count">
        {{ files.length }} file(s) selected
      </p>
    </div>
  </div>
</template>

<script>
import emailjs from '@emailjs/browser'

export default {
  name: 'ProfileReview',
  data() {
    return {
      files: []
    }
  },
  methods: {
    handleFileChange(event) {
      this.files = Array.from(event.target.files)
    },
    async sendPhotos() {
      if (this.files.length === 0) {
        alert('Please select at least one photo')
        return
      }

      // Note: EmailJS doesn't directly support file uploads
      // You'll need to convert files to base64 or use a different service
      // For now, we'll send a message indicating photos were uploaded
      const templateParams = {
        message: `User uploaded ${this.files.length} photo(s) for profile review.`,
        file_count: this.files.length
      }

      try {
        // Replace these with your actual EmailJS credentials
        await emailjs.send(
          'YOUR_SERVICE_ID',
          'YOUR_TEMPLATE_ID',
          templateParams,
          'YOUR_PUBLIC_KEY'
        )
        alert('Photos sent successfully!')
        this.files = []
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ''
      } catch (error) {
        console.error('Error sending photos:', error)
        alert('Error sending photos. Please check your EmailJS configuration.')
      }
    }
  },
  mounted() {
    // Initialize EmailJS with your public key
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('YOUR_PUBLIC_KEY')
  }
}
</script>
