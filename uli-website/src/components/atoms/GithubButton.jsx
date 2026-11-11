import React from "react";

export default function GithubButton({ className = "" }) {
  return (
    <a
      href="https://github.com/tattle-made/Uli/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View Uli on GitHub"
      className={`inline-flex items-center justify-center gap-[6px] bg-[#2d2d2d] px-[10px] py-[4px] text-white no-underline transition-colors duration-200 ease-in-out hover:bg-[#F28948] active:bg-[#d97232] select-none ${className}`}
    >
      <svg
        className="w-[16px] h-[16px] shrink-0 fill-current"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12.6667 9.33333H11.3333V10.6667H10V12H11.3333V14.6667H4.66667V12H2V10.6667H0.666667V9.33333H2V10.6667H4.66667V9.33333H3.33333V8H2V4H3.33333V1.33333H6V2.6667H10V1.33333H12.6667V4H14V8H12.6667V9.33333ZM4.66667 12H6V10.6667H4.66667V12Z" />
      </svg>
      <span className="font-labrada font-medium text-[16px] leading-normal text-white">
        Github
      </span>
    </a>
  );
}

