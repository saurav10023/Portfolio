import btlkhome from '../assets/btlkhome.png';
import admissions from '../assets/admissions.png';

import home from '../assets/skool-cart-home.png';
import uniform from '../assets/uniform_sets.png';
import admin_dashboard from '../assets/admin_dashboard.png';
import admin_orders from '../assets/admin_orders.png';

import gfhome from '../assets/gfhome.png';
import gfadmin from '../assets/gfadmin.png';
import gffeatured from '../assets/gffeatured.png';

/*
  Fields used by ProjectsSection:
    kind      short label for what the project is
    status    { label, state }  state is 'live' or 'building'
    summary   2-3 lines shown on the FRONT of the card
    overview  longer paragraph shown on the BACK of the card
    highlights  four { title, text } items shown on the BACK
    facts     small { label, value } pairs shown on the BACK
    images    1 to 4 screenshots, shown in the gallery
*/

export const projects = [
  {
    number: '01',
    name: 'School Cart',
    kind: 'Full-stack web app',
    status: { label: 'Live in production', state: 'live' },
    summary:
      'A uniform ordering platform for Skool Box with secure sign-in, online payments and an admin dashboard. Live, and still growing.',
    overview:
      'School Cart lets families order complete school uniform sets online, while the Skool Box team runs orders from a back-office dashboard. I built the whole product: the React storefront, the Node and Express API, the MongoDB data layer and the payment flow. It is live in production and I keep extending it as part of an ongoing engagement.',
    highlights: [
      {
        title: 'Modular backend',
        text: '50+ REST endpoints on an MVC structure, organised so new features slot in cleanly.',
      },
      {
        title: 'Secure sign-in',
        text: 'JWT sessions combined with Firebase phone OTP verification.',
      },
      {
        title: 'Online payments',
        text: 'Razorpay checkout wired into the order flow, from cart to confirmation.',
      },
      {
        title: 'Admin dashboard',
        text: 'Dashboard and order management screens for the Skool Box team.',
      },
    ],
    facts: [
      { label: 'Role', value: 'Full-stack developer' },
      { label: 'Client', value: 'Skool Box' },
      { label: 'Engagement', value: 'Ongoing' },
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Razorpay', 'Firebase'],
    liveUrl: 'https://skool-box.vercel.app',
    accent: '#7CE7C4',
    images: [home, uniform, admin_orders, admin_dashboard],
  },
  {
    number: '02',
    name: 'Bachpan School',
    kind: 'Freelance website',
    status: { label: 'Live', state: 'live' },
    summary:
      'A responsive school website, taken from client brief to launch, now handling admissions and parent inquiries.',
    overview:
      'A freelance project for Bachpan School. I worked from the school\u2019s requirements through design, development and deployment. The site presents the school clearly to parents and walks them through admissions, and it is live today, serving admissions interest and parent inquiries.',
    highlights: [
      {
        title: 'Responsive by default',
        text: 'React and TailwindCSS, built to read cleanly from small phones to wide desktops.',
      },
      {
        title: 'Admissions focus',
        text: 'A dedicated admissions page that guides parents to what they need.',
      },
      {
        title: 'Brief to launch',
        text: 'Requirements, build, deployment and handover handled end to end.',
      },
      {
        title: 'In daily use',
        text: 'Live and actively serving admissions and parent inquiries.',
      },
    ],
    facts: [
      { label: 'Role', value: 'Freelance developer' },
      { label: 'Client', value: 'Bachpan School' },
      { label: 'Scope', value: 'Design to deployment' },
    ],
    stack: ['React', 'TailwindCSS', 'Responsive Design'],
    liveUrl: 'https://bachpangumla.com',
    accent: '#9BB6FF',
    images: [btlkhome, admissions],
  },
  {
    number: '03',
    name: 'Galaxy Furniture',
    kind: 'Full-stack catalogue and business manager',
    status: { label: 'In development', state: 'building' },
    summary:
      'A calm Japandi showroom where customers browse and enquire on WhatsApp, plus an admin panel for stock, sales, dues and analytics.',
    overview:
      'Galaxy Furniture is an online showroom for a furniture shop, styled in a Japandi look. Customers browse the catalogue and reach the shop on WhatsApp, which matches how the shop already sells. Behind it, an admin panel helps the owner run the business: inventory, sales, pending payment dues and analytics. It is currently in development.',
    highlights: [
      {
        title: 'Showroom first',
        text: 'Customers browse products and start the conversation on WhatsApp.',
      },
      {
        title: 'Inventory control',
        text: 'Manage products and stock from one admin panel.',
      },
      {
        title: 'Sales and dues',
        text: 'Record sales and keep track of payments still pending.',
      },
      {
        title: 'Analytics',
        text: 'Business numbers in one place, so the owner can see how the shop is doing.',
      },
    ],
    facts: [
      { label: 'Role', value: 'Full-stack developer' },
      { label: 'Type', value: 'Catalogue and admin' },
      { label: 'Status', value: 'In development' },
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB Atlas', 'Mongoose', 'TailwindCSS'],
    liveUrl: '', // add the link once it's deployed
    accent: '#E8C9A0',
    images: [gfhome, gffeatured, gfadmin],
  },
];