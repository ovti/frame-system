// const SERVER_LINK = '/~21_zalubski/gragraframe/';
const SERVER_LINK = '';

const floatingImages = [
  {
    src: `${SERVER_LINK}images/main1.png`,
    className:
      'left-[7%] top-[12%] h-24 w-24 animate-float-slow opacity-30 rotate-32',
  },
  {
    src: `${SERVER_LINK}images/main2.png`,
    className:
      'right-[9%] top-[10%] h-32 w-32 animate-float-medium opacity-30 delay-float-1',
  },
  {
    src: `${SERVER_LINK}images/main3.png`,
    className:
      'left-[14%] bottom-[14%] h-28 w-28 animate-float-fast opacity-30 delay-float-2',
  },
  {
    src: `${SERVER_LINK}images/main1.png`,
    className:
      'right-[17%] bottom-[17%] h-20 w-20 animate-float-medium opacity-25 delay-float-3',
  },
  {
    src: `${SERVER_LINK}images/main2.png`,
    className:
      'left-[38%] top-[7%] h-24 w-24 animate-float-fast opacity-25 delay-float-4',
  },
  {
    src: `${SERVER_LINK}images/main3.png`,
    className:
      'right-[34%] bottom-[9%] h-24 w-24 animate-float-slow opacity-25 delay-float-5',
  },
  {
    src: `${SERVER_LINK}images/main1.png`,
    className:
      'left-[28%] top-[22%] h-16 w-16 animate-float-medium opacity-20 delay-float-2',
  },
  {
    src: `${SERVER_LINK}images/main2.png`,
    className:
      'right-[27%] top-[26%] h-20 w-20 animate-float-slow opacity-20 delay-float-4',
  },
  {
    src: `${SERVER_LINK}images/main3.png`,
    className:
      'left-[5%] bottom-[36%] h-20 w-20 animate-float-fast opacity-20 delay-float-1 rotate-12',
  },
  {
    src: `${SERVER_LINK}images/main1.png`,
    className:
      'right-[5%] bottom-[35%] h-24 w-24 animate-float-slow opacity-20 delay-float-3 rotate-12',
  },
  {
    src: `${SERVER_LINK}images/main2.png`,
    className:
      'left-[48%] bottom-[5%] h-20 w-20 animate-float-medium opacity-20 delay-float-5 rotate-24',
  },
  {
    src: `${SERVER_LINK}images/main3.png`,
    className:
      'right-[48%] top-[5%] h-16 w-16 animate-float-fast opacity-20 delay-float-1 rotate-24',
  },
  {
    src: `${SERVER_LINK}images/main1.png`,
    className:
      'left-[22%] top-[48%] h-14 w-14 animate-float-slow opacity-20 delay-float-4',
  },
  {
    src: `${SERVER_LINK}images/main2.png`,
    className:
      'right-[22%] top-[48%] h-16 w-16 animate-float-medium opacity-20 delay-float-2',
  },
  {
    src: `${SERVER_LINK}images/main3.png`,
    className:
      'left-[72%] top-[62%] h-20 w-20 animate-float-fast opacity-20 delay-float-5',
  },
];

function FloatingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {floatingImages.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt=""
          aria-hidden="true"
          className={`absolute object-contain select-none ${image.className}`}
        />
      ))}
    </div>
  );
}

export default FloatingBackground;
