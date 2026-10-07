// src/data/services.js
// status: 'live' = shipped in production, 'learning' = currently building skills

export const services = [
  {
    number: '01',
    name: 'Full-Stack Web Development',
    description:
      'End-to-end MERN applications, built independently from requirements to production deployment and post-launch maintenance.',
    highlights: [
      'School Cart: live e-commerce platform with real transactions',
      'Modular MVC architecture for clean, scalable code',
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    accent: '#5EEAD4',
    status: 'live',
  },
  {
    number: '02',
    name: 'Responsive Websites',
    description:
      'Fast, accessible, pixel-clean websites for schools, businesses and institutions that look right on mobile, tablet and desktop.',
    highlights: [
      'Bachpan School website live for admissions and parent inquiries',
      'Cross-browser testing and edge-case debugging',
    ],
    stack: ['React.js', 'TailwindCSS', 'HTML5', 'CSS3'],
    accent: '#38BDF8',
    status: 'live',
  },
  {
    number: '03',
    name: 'REST API & Backend Design',
    description:
      'Secure, well-structured backends with proper authentication, role-based access and thoroughly tested endpoints.',
    highlights: [
      '50+ RESTful endpoints across Routes, Controllers and Middleware',
      'JWT access/refresh rotation, bcrypt, Firebase Phone OTP, Admin/User roles',
    ],
    stack: ['JWT', 'bcrypt', 'Firebase', 'Postman'],
    accent: '#A78BFA',
    status: 'live',
  },
  {
    number: '04',
    name: 'Payments & E-Commerce',
    description:
      'Checkout flows you can trust: payments, refunds and inventory that stay consistent even when orders fail or get cancelled.',
    highlights: [
      'Razorpay with server-side signature verification, plus COD',
      'Automated refunds and atomic per-size stock adjustments',
    ],
    stack: ['Razorpay', 'Mongoose', 'Nodemailer', 'jsPDF'],
    accent: '#FBBF24',
    status: 'live',
  },
  {
    number: '05',
    name: 'EDA & Data Analysis',
    description:
      'Turning raw, messy datasets into clear insight: cleaning, profiling, visualising and finding the patterns that matter.',
    highlights: [
      'Data cleaning, missing-value and outlier handling',
      'Statistical summaries and visual storytelling',
    ],
    stack: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
    accent: '#A3E635',
    status: 'learning',
  },
  {
    number: '06',
    name: 'Feature Engineering & ML',
    description:
      'Building the features and baseline models that make predictions work, grounded in strong DSA and CS fundamentals.',
    highlights: [
      'Feature creation, encoding and scaling pipelines',
      'Model training, evaluation and iteration',
    ],
    stack: ['Python', 'Scikit-learn', 'Feature Engineering', 'ML'],
    accent: '#FB7185',
    status: 'learning',
  },
];