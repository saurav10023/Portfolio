// Swap the placeholder image URLs below for real screenshots of each
// project (e.g. export crops from your own portfolio assets) — the
// placehold.co links are only here so the layout has something to render.
import btlkhome from "../assets/btlkhome.png"
import admissions from "../assets/admissions.png"

import home from "../assets/skool-cart-home.png"
import uniform from "../assets/uniform_sets.png"
import admin_dashboard from "../assets/admin_dashboard.png"
import admin_orders from "../assets/admin_orders.png"
export const projects = [
  {
    number: '01',
    category: 'Full-Stack • MERN • Live in Production',
    name: 'School Cart',
    blurb:
      '50+ REST endpoints on a modular MVC backend, JWT + Firebase OTP auth, and Razorpay payments — now run in an ongoing engagement with Skool Box.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Razorpay', 'Firebase'],
    liveUrl: 'https://skool-box.vercel.app',
    accent: '#7CE7C4',
    col1Image1: admin_orders,
    col1Image2: uniform,
    col2Image: home,
  },
  {
    number: '02',
    category: 'Freelance • React.js + TailwindCSS',
    name: 'Bachpan School',
    blurb:
      'Fully responsive school website built end-to-end — from client requirements to deployment — live and actively serving admissions and parent inquiries.',
    stack: ['React', 'TailwindCSS', 'Responsive Design'],
    liveUrl: 'https://bachpangumla.com',
    accent: '#9BB6FF',
    col1Image1: btlkhome,
    col1Image2: admissions,
    col2Image: btlkhome,
  },
];