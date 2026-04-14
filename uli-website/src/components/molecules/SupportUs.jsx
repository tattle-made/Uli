import React, { useState } from "react";
import { Box, Text } from "grommet";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { navigate } from "gatsby";

const MaskIcon = ({ url, color, size = 34, className }) => (
  <div
    className={className}
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      maskImage: `url("${url}")`,
      WebkitMaskImage: `url("${url}")`,
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      transition: 'background-color 0.3s ease'
    }}
  />
);

const items = [
  {
    title: "Contribute to the Dataset",
    description: "You can contribute to the dataset as an individual through the Uli Community Page. You can also conduct a crowdsourcing workshop with your language/regional community. Please reach out to poorvi@tattle.co.in",
    buttonText: "Uli Community",
    iconUrl: "/support_icons/database.svg",
    url: "https://uli-community.tattle.co.in/"
  },
  {
    title: "Host a workshop on OGBV",
    description: "If you would like us to conduct a workshop with your students or your organization on OGBV or online safety, please email poorvi@tattle.co.in",
    buttonText: "Email Us",
    iconUrl: "/support_icons/workshop.svg"
  },
  {
    title: "Sponsor a track",
    description: "We are looking for funders who can help grow the three tracks: datasets, workshops and abuse response. Each track has a different roadmap. If you are a funder working on online safety, please reach out to admin@tattle.co.in",
    buttonText: "",
    iconUrl: "/support_icons/support.svg"
  },
  {
    title: "Sponsor us on Github",
    description: "If you are an individual who wants to support the overall project, consider becoming a GitHub sponsor. The GitHub sponsor's money is pooled and may be used for any of the three tracks. All sponsors will be added to the Uli mailing list for periodic updates on the project.",
    buttonText: "Github Sponsors",
    iconUrl: "/support_icons/github.svg",
    url: "https://github.com/sponsors/tattle-made"
  }
];

const PixelatedArrow = ({ color, isOpen }) => (
  <MaskIcon
    url="/Arrow.svg"
    color={color}
    size={24}
    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
  />
);

const HighlightedDescription = ({ text }) => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const parts = text.split(emailRegex);

  return (
    <div className="text-[15px] md:text-[18px] leading-[1.2em] w-full mt-2" style={{ color: "#000000", fontFamily: "'Labrada', serif" }}>
      {parts.map((part, i) =>
        emailRegex.test(part) ? (
          <a
            key={i}
            href={`mailto:${part}`}
            className="underline font-bold hover:opacity-60 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        ) : part
      )}
    </div>
  );
};

function AccordionItem({ item, isOpen, onToggle }) {
  const [isHover, setIsHover] = useState(false);

  let bg = "transparent";
  let borderColor = "#FFF6E8";
  let textColor = "#FFF6E8";

  if (isOpen) {
    bg = "#FFF6E8";
    borderColor = "#000000";
    textColor = "#000000";
  } else if (isHover) {
    bg = "#FFF6E8";
    borderColor = "#FFF6E8";
    textColor = "#000000";
  }

  const dashedBorderStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='${encodeURIComponent(borderColor)}' stroke-width='2.6' stroke-dasharray='8%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
    backgroundPosition: 'center',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onToggle}
      className="w-full flex flex-col cursor-pointer transition-all duration-300 overflow-hidden"
      style={{
        backgroundColor: bg,
        ...dashedBorderStyle,
        minHeight: '82px'
      }}
    >
      <div
        className="grid grid-cols-[44px_1fr_32px] md:grid-cols-[44px_1fr_40px] items-center w-full p-[22px] gap-4 md:gap-6"
        style={{ boxSizing: 'border-box' }}
      >
        <div className="flex justify-center flex-shrink-0">
          <MaskIcon url={item.iconUrl} color={textColor} size={34} />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="text-[19px] md:text-[34px] leading-[1.1em] break-words block w-full"
            style={{ color: textColor, fontFamily: "'XStitch', sans-serif" }}
          >
            {item.title}
          </span>
        </div>
        <div className="flex justify-end flex-shrink-0">
          <PixelatedArrow color={textColor} isOpen={isOpen} />
        </div>
      </div>

      {isOpen && <div
        style={{
          maxHeight: isOpen ? '450px' : '0px',
          transition: 'max-height 0.4s ease-in-out, opacity 0.3s ease-in-out',
          padding: isOpen ? '0 22px 30px 22px' : '0 22px'
        }}
      >
        <div className="flex flex-col gap-[20px] pt-2 border-t border-black/10">
          <HighlightedDescription text={item.description} />
          {item.buttonText.length != 0 && <button
            className="bg-black py-[12px] px-[24px] w-max mt-4 border-none outline-none cursor-pointer hover:bg-[#333333] transition-colors active:scale-95 transform"
            onClick={(e) => {
              e.stopPropagation();
              if (item.buttonText.toLowerCase().includes('email')) {
                window.location.href = `mailto:${item.description.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)?.[0] || 'admin@tattle.co.in'}`;
              }
              if (item.url) {
                window.location.href = item.url
              }
            }}
          >
            <span className="text-[16px] md:text-[20px] leading-[1.2em] text-white" style={{ fontFamily: "'Labrada', serif" }}>
              {item.buttonText}
            </span>
          </button>}



        </div>
      </div>}
    </div>
  );
}

export default function SupportUs() {
  const [activeIndex, setActiveIndex] = useState(null);
  const revealRef = useScrollReveal({ threshold: 0.1 });

  return (
    <Box
      ref={revealRef}
      className="reveal bg-[#2D2D2D] pt-32 pb-20 px-4 md:px-5 text-white flex flex-col items-center gap-12 smooth-layout"
    >
      <div className="flex flex-col items-center gap-3">
        <Text
          className="text-center text-[40px] md:text-[64px] leading-[1.14em]"
          style={{ fontFamily: "'Eenvoudige Batik', sans-serif" }}
        >
          Support Our Work
        </Text>
        <Text
          className="text-center text-[20px]"
          style={{ fontFamily: "'Labrada', serif", color: "#FFF6E8" }}
        >
          You can support Uli's work in the following ways.
        </Text>
      </div>

      <div className="flex flex-col gap-6 mt-8 w-full items-center max-w-[800px]">
        {items.map((item, idx) => (
          <AccordionItem
            key={idx}
            item={item}
            isOpen={activeIndex === idx}
            onToggle={() => setActiveIndex(activeIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </Box>
  );
}




