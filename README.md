# Date Coaching Website

A Vue.js 3 single-page application for date coaching services with three main pages:
- Home page with service options
- Profile Review (upload photos)
- Ask for Advice

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure EmailJS:
   - Sign up at [EmailJS](https://www.emailjs.com/)
   - Get your Public Key, Service ID, and Template ID
   - Replace the placeholders in:
     - `src/views/ProfileReview.vue`
     - `src/views/AskAdvice.vue`
   - Replace `YOUR_PUBLIC_KEY`, `YOUR_SERVICE_ID`, and `YOUR_TEMPLATE_ID`

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
mm-website/
├── src/
│   ├── views/
│   │   ├── Home.vue
│   │   ├── ProfileReview.vue
│   │   └── AskAdvice.vue
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── vite.config.js
└── package.json
```

## Technologies

- Vue 3
- Vue Router 4
- Vite
- EmailJS
