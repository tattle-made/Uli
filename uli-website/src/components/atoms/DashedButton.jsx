import React from "react";

export default function DashedButton({ content, onClick, className = "" }) {
  const dashedSvgBorder = {
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23000000' stroke-width='2' stroke-dasharray='8%2c 4' stroke-linecap='square'/%3e%3c/svg%3e")`,
    backgroundPosition: "center",
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
  };

  return (
    <button
      style={dashedSvgBorder}
      className={`font-labrada bg-transparent cursor-pointer border-none outline-none hover:bg-[#FFC8A6] active:bg-[#F28948] transition-colors duration-150 ${className}`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
