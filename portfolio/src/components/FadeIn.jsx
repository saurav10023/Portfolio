import { motion } from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1];

/**
 * FadeIn
 * Generic scroll-triggered fade/slide-in wrapper.
 *
 * Props:
 *  - delay: number (s)
 *  - duration: number (s), default 0.7
 *  - x, y: starting offset in px, default x=0, y=30
 *  - as: element/tag to render, default 'div'
 */
const FadeIn = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = '',
  style = {},
  as = 'div',
  ...rest
}) => {
  const Component = motion.create(as);

  const variants = {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { delay, duration, ease: EASE },
    },
  };

  return (
    <Component
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '50px', amount: 0 }}
      variants={variants}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default FadeIn;
