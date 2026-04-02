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
import { createStripeCheckoutSession } from '../lib/createStripeCheckoutSession'

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

      try {
        const pending = {
          service: 'profile_review',
          email: this.email,
          photoUrl,
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
