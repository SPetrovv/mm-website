export async function createStripeCheckoutSession({ service }) {
  let res
  try {
    res = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service })
    })
  } catch (e) {
    const hint =
      import.meta.env.DEV
        ? ' Start `npm run dev:functions` in another terminal (functions on :9999), or run `npm run dev:netlify` and use Netlify’s URL instead of :5173.'
        : ''
    throw new Error(
      (e?.message || 'Network error') +
        '.' +
        hint
    )
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const devHint =
      ' With plain Vite, run `npm run dev:functions` in another terminal, or use `npm run dev:netlify` and open Netlify’s URL (not :5173).'
    if (import.meta.env.DEV && (res.status === 404 || res.status === 502 || res.status === 504)) {
      throw new Error(
        (res.status === 404
          ? 'Netlify function not found on the dev server.'
          : 'Cannot reach the local Netlify Functions server (proxy error).') +
          devHint +
          (text ? ` ${text}` : '')
      )
    }
    throw new Error(text || 'Failed to create Stripe checkout session.')
  }

  const data = await res.json().catch(() => ({}))
  if (!data?.url) throw new Error('Stripe checkout URL is missing.')
  return data // { id, url }
}

