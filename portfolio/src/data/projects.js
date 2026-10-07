import btlkhome from "../assets/btlkhome.png"
import admissions from "../assets/admissions.png"

import home from "../assets/skool-cart-home.png"
import uniform from "../assets/uniform_sets.png"
import admin_dashboard from "../assets/admin_dashboard.png"
import admin_orders from "../assets/admin_orders.png"



import gfhome from"../assets/gfhome.png"
import gfadmin from "../assets/gfadmin.png"
import gffeatured from "../assets/gffeatured.png"

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
  {
    number: '03',
    category: 'Full-Stack • Catalog + Business Management • In Development',
    name: 'Galaxy Furniture',
    blurb:
      'A Japandi-styled online showroom where customers browse products and reach the shop via WhatsApp, paired with an admin panel for inventory, sales, payment dues and analytics.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB Atlas', 'Mongoose', 'TailwindCSS'],
    liveUrl: '', // add the link once it's deployed
    accent: '#E8C9A0',
    col1Image1: gfadmin,
    col1Image2: gffeatured,
    col2Image: gfhome,
  },
];