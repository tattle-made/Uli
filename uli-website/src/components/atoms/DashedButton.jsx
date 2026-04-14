import React from "react";

export default function DashedButton({ content, onClick, className = "" }) {
  return (
    <button
      className={`font-labrada bg-transparent cursor-pointer border-[0.5px] border-solid [border-image-source:url('/dashed-btn-bg.png')] [border-image-slice:0%_fill] [border-image-repeat:stretch] hover:bg-[#FFC8A6] active:bg-[#F28948] ${className}`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
