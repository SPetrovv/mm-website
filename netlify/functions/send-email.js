function getEmailJsConfig(service) {
  const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID
  const userId = process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY
  // Strict mode (EmailJS Account Security): REST calls from the server must include the private key as `accessToken`.
  const accessToken =
    process.env.EMAILJS_PRIVATE_KEY ||
    process.env.EMAILJS_ACCESS_TOKEN ||
    process.env.EMAILJS_SECRET ||
    ''

  const askAdviceTemplateId =
    process.env.EMAILJS_TEMPLATE_ASK_ADVICE_ID || process.env.VITE_EMAILJS_TEMPLATE_ASK_ADVICE_ID
  const profileReviewTemplateId =
    process.env.EMAILJS_TEMPLATE_PROFILE_REVIEW_ID ||
    process.env.VITE_EMAILJS_TEMPLATE_PROFILE_REVIEW_ID

  const templateId =
    service === 'ask_advice'
      ? askAdviceTemplateId
      : service === 'profile_review'
        ? profileReviewTemplateId
        : ''

  return { serviceId, userId, accessToken, templateId }
}

function buildTemplateParams(service, payload) {
  if (service === 'ask_advice') {
    return {
      topic: payload.topic,
      name: payload.title,
      from_email: payload.email,
      message: payload.message
    }
  }

  if (service === 'profile_review') {
    const photoUrls = Array.isArray(payload.photoUrls)
      ? payload.photoUrls.filter(Boolean)
      : payload.photoUrl
        ? [payload.photoUrl]
        : []
    const photoUrlsText = photoUrls.length ? photoUrls.join('\n') : 'No photo URLs provided.'

    return {
      message: `User uploaded ${payload.fileCount} photo(s) for profile review.\nPhoto URLs:\n${photoUrlsText}`,
      from_email: payload.email,
      file_count: payload.fileCount,
      image_url: photoUrlsText,
      image_urls: photoUrlsText
    }
  }

  throw new Error('Unknown email service.')
}

export const handler = async (event) => {
  if (event.httpMethod && event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const body = event.body
      ? typeof event.body === 'string'
        ? JSON.parse(event.body)
        : event.body
      : {}

    const service = body.service
    const payload = body.payload || {}

    const { serviceId, userId, accessToken, templateId } = getEmailJsConfig(service)
    if (!serviceId || !userId || !templateId) {
      throw new Error('Missing EmailJS server configuration.')
    }

    const templateParams = buildTemplateParams(service, payload)
    const emailJsBody = {
      service_id: serviceId,
      template_id: templateId,
      user_id: userId,
      template_params: templateParams
    }

    if (accessToken) {
      emailJsBody.accessToken = accessToken
    }

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailJsBody)
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      const hint =
        /private key|strict mode/i.test(text || '')
          ? ' Set EMAILJS_PRIVATE_KEY in Netlify (Site settings → Environment variables) to your EmailJS private key from Account → API keys. For local Netlify dev, add the same to .env or .env.local in the project root.'
          : ''
      return {
        statusCode: res.status,
        body: (text || 'EmailJS request failed.') + hint
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: err?.message || 'Failed to send email.'
    }
  }
}

