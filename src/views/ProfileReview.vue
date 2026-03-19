<template>
  <div class="container form-page">
    <h2>Profile Review 📸</h2>
    <div class="card">
      <p>Upload your photos and we will help you improve your dating profile.</p>
      <input 
        v-model="email" 
        placeholder="Email" 
        type="email"
      />
      <input 
        type="file" 
        accept="image/*"
        @change="handleFileChange" 
      />
      <button @click="sendPhotos" :disabled="!email || files.length === 0 || !!errorMessage || uploading">
        Send
      </button>
      <p v-if="errorMessage" class="file-count">
        {{ errorMessage }}
      </p>
      <p v-if="uploading" class="file-count">
        Uploading...
      </p>
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
      email: '',
      files: [],
      errorMessage: '',
      uploading: false
    }
  },
  methods: {
    handleFileChange(event) {
      this.errorMessage = ''
      const selectedFiles = Array.from(event.target.files || [])

      if (selectedFiles.length === 0) {
        this.files = []
        return
      }

      const file = selectedFiles[0]
      const maxBytes = 10 * 1024 * 1024
      if (file.size > maxBytes) {
        this.files = []
        this.errorMessage = 'File is too large. Max size is 10MB.'
        if (event.target) event.target.value = ''
        return
      }

      this.files = [file]
    },
    async uploadToCloudinary(file) {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

      if (!cloudName || !uploadPreset) {
        throw new Error('Missing Cloudinary configuration.')
      }

      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)

      const res = await fetch(url, {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        let details = ''
        try {
          const json = await res.json()
          details = json?.error?.message ? ` ${json.error.message}` : ''
        } catch {
          details = ''
        }
        throw new Error(`Cloudinary upload failed.${details}`)
      }

      const json = await res.json()
      if (!json?.secure_url) {
        throw new Error('Cloudinary did not return an image URL.')
      }
      return json.secure_url
    },
    async sendPhotos() {
      if (!this.email) {
        this.errorMessage = 'Please enter your email.'
        return
      }

      if (this.files.length === 0) {
        alert('Please select at least one photo')
        return
      }

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_PROFILE_REVIEW_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) {
        this.errorMessage = 'Missing EmailJS configuration.'
        return
      }

      const maxBytes = 10 * 1024 * 1024
      if (this.files[0] && this.files[0].size > maxBytes) {
        this.errorMessage = 'File is too large. Max size is 10MB.'
        return
      }

      this.uploading = true
      this.errorMessage = ''
      let photoUrl = ''
      try {
        photoUrl = await this.uploadToCloudinary(this.files[0])
      } catch (e) {
        this.errorMessage = e?.message || 'Failed to upload image.'
        this.uploading = false
        return
      }

      // Note: EmailJS doesn't directly support file uploads
      // You'll need to convert files to base64 or use a different service
      // For now, we'll send a message indicating photos were uploaded
      const templateParams = {
        message: `User uploaded ${this.files.length} photo(s) for profile review.\nPhoto URL: ${photoUrl}`,
        from_email: this.email,
        file_count: this.files.length,
        image_url: photoUrl
      }

      try {
        // Replace these with your actual EmailJS credentials
        await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          publicKey
        )
        alert('Photos sent successfully!')
        this.email = ''
        this.files = []
        this.errorMessage = ''
        this.uploading = false
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ''
      } catch (error) {
        console.error('Error sending photos:', error)
        this.uploading = false
        alert('Error sending photos. Please check your EmailJS configuration.')
      }
    }
  },
  mounted() {
    // Initialize EmailJS with your public key
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    if (publicKey) emailjs.init(publicKey)
  }
}
</script>
