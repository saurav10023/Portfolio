import { useEffect, useRef, useState } from 'react';
import { marqueeRow1, marqueeRow2 } from '../data/marqueeImages';

const tripled = (arr) => [...arr, ...arr, ...arr];

const MarqueeRow = ({ images, offset, direction }) => {
  const translate = direction === 'right' ? offset - 200 : -(offset - 200);

  return (
    <div
      className="flex gap-3"
      style={{ transform: `translateX(${translate}px)`, willChange: 'transform' }}
    >
      {tripled(images).map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          className="rounded-2xl object-cover flex-shrink-0"
          style={{ width: 420, height: 270 }}
        />
      ))}
    </div>
  );
};

const MarqueeSection = () => {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const value = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(value);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
    >
      <div className="flex flex-col gap-3">
        <MarqueeRow images={marqueeRow1} offset={offset} direction="right" />
        <MarqueeRow images={marqueeRow2} offset={offset} direction="left" />
      </div>
    </section>
  );
};

export default MarqueeSection;
