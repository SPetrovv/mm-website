import Stripe from 'stripe';

function getOrigin(headers) {
  const origin = headers && (headers.origin || headers.Origin);
  if (origin) return origin;

  const proto =
    headers &&
    (headers['x-forwarded-proto'] || headers['X-Forwarded-Proto'] || 'https');
  const host = headers && (headers['x-forwarded-host'] || headers.host);

  if (!host) throw new Error('Missing host header; cannot build origin.');
  return `${proto}://${host}`;
}

function buildSuccessCancelUrls(origin, service) {
  const safeService = encodeURIComponent(service || 'profile_review');
  const successUrl = `${origin}/success?service=${safeService}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/cancel?service=${safeService}&session_id={CHECKOUT_SESSION_ID}`;
  return { successUrl, cancelUrl };
}

export const handler = async (event) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const headers = event.headers || {};
    const body = event.body
      ? typeof event.body === 'string'
        ? JSON.parse(event.body)
        : event.body
      : {};
    const service = body.service || 'profile_review';
    const origin = getOrigin(headers);
    const { successUrl, cancelUrl } = buildSuccessCancelUrls(origin, service);

    // Only `card` is valid here. Apple Pay / Google Pay are wallet UIs for cards;
    // Stripe Checkout shows them automatically when the browser/device supports them.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: service === 'ask_advice' ? 'Ask for Advice' : 'Profile Review' },
            unit_amount: 499,
          },
          quantity: 1,
        },
      ],
      metadata: { service },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
