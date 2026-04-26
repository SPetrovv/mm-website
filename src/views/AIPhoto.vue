<template>
  <div class="container form-page">
    <h2>AI Photo Enhancer 📸</h2>
    <div class="card">
      <p>Upload your photos and we will help you improve your dating profile.</p>
      <p class="file-count">
        Great idea: send 2 photos - one clear face photo and one full-body photo.
      </p>
      <input 
        v-model="email" 
        placeholder="Email" 
        type="email"
        @blur="validateEmail"
      />
      <p v-if="emailError" class="file-count" style="color: #e74c3c;">
        {{ emailError }}
      </p>
      <input 
        type="file" 
        accept="image/*"
        multiple
        @change="handleFileChange" 
      />
      <button @click="sendPhotos" :disabled="!email || files.length === 0 || !!errorMessage || uploading || !!emailError">
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
      <p class="file-count">
        Max image size: 10MB per photo.
      </p>
    </div>
  </div>
</template>

<script>
import { createStripeCheckoutSession } from '../lib/createStripeCheckoutSession'

export default {
  name: 'AIPhoto',
  data() {
    return {
      email: '',
      emailError: '',
      files: [],
      errorMessage: '',
      uploading: false
    }
  },
  methods: {
    getMaxImageBytes() {
      return 10 * 1024 * 1024
    },
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },
    validateEmail() {
      if (this.email && !this.isValidEmail(this.email)) {
        this.emailError = 'Please enter a valid email address.'
      } else {
        this.emailError = ''
      }
    },
    handleFileChange(event) {
      this.errorMessage = ''
      const selectedFiles = Array.from(event.target.files || [])
      const maxBytes = this.getMaxImageBytes()

      if (selectedFiles.length === 0) {
        this.files = []
        return
      }

      const oversizedFile = selectedFiles.find((file) => file.size > maxBytes)
      if (oversizedFile) {
        this.files = []
        this.errorMessage = `File "${oversizedFile.name}" is too large. Max size is 10MB per image.`
        if (event.target) event.target.value = ''
        return
      }

      this.files = selectedFiles
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
      if (!this.isValidEmail(this.email)) {
        this.emailError = 'Please enter a valid email address.'
        return
      }

      if (this.files.length === 0) {
        alert('Please select at least one photo')
        return
      }

      const maxBytes = this.getMaxImageBytes()
      const oversizedFile = this.files.find((file) => file.size > maxBytes)
      if (oversizedFile) {
        this.errorMessage = `File "${oversizedFile.name}" is too large. Max size is 10MB per image.`
        return
      }

      this.uploading = true
      this.errorMessage = ''
      let photoUrls = []
      try {
        photoUrls = await Promise.all(this.files.map((file) => this.uploadToCloudinary(file)))
      } catch (e) {
        this.errorMessage = e?.message || 'Failed to upload image.'
        this.uploading = false
        return
      }

      try {
        const pending = {
          service: 'profile_review',
          email: this.email,
          photoUrl: photoUrls[0] || '',
          photoUrls,
          fileCount: this.files.length
        }

        localStorage.setItem('mm_stripe_pending', JSON.stringify(pending))

        const data = await createStripeCheckoutSession({ service: 'profile_review' })
        window.location.assign(data.url)
      } catch (error) {
        console.error('Stripe checkout error:', error)
        this.uploading = false
        localStorage.removeItem('mm_stripe_pending')
        alert(error?.message || 'Stripe checkout failed. Please try again.')
      }
    }
  }
}
</script>
