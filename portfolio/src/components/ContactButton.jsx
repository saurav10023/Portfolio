const ContactButton = ({ className = '' }) => {
  return (
    <a
      href="#contact"
      className={`inline-block rounded-full text-white font-medium uppercase tracking-widest text-xs sm:text-sm md:text-base px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 transition-opacity duration-200 hover:opacity-90 active:opacity-75 ${className}`}
      style={{
        background:
          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow:
          '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid #E3E3E3',
        outlineOffset: '-3px',
      }}
    >
      Contact Me
    </a>
  );
};

export default ContactButton;
