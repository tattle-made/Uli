import React from "react";
import { Box } from "grommet";
import { Link } from "gatsby";

export default function FooterNew() {
  const linkClasses =
    "text-white no-underline hover:text-[#F28948] hover:underline transition-colors duration-200 text-[16px] font-medium";

  return (
    <div className="bg-[#2D2D2D] w-full flex flex-col items-center">
      {/* Dashed divider above Footer links from Figma node 493:287 */}
      <div className="w-full flex justify-center px-4 md:px-12">
        <svg
          className="w-full max-w-[1130px] h-[1px]"
          viewBox="0 0 1130 1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="0.5"
            x2="1130"
            y2="0.5"
            stroke="#FFF6E8"
            strokeOpacity="0.4"
            strokeDasharray="8 6"
          />
        </svg>
      </div>

      <div className="w-full max-w-[1130px] py-10 px-4 md:px-12 font-labrada text-white flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Left Side: Uli & Left-aligned email */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <span className="text-[22px] md:text-[24px] font-medium text-white">
            Uli
          </span>
          <a
            href="mailto:admin@tattle.co.in"
            className="text-[16px] text-white/90 hover:text-[#F28948] hover:underline no-underline transition-colors duration-200"
          >
            admin@tattle.co.in
          </a>
        </div>

        {/* Right Side: Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-3">
          <a
            href="https://tattle.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClasses}
          >
            Tattle
          </a>
          <a
            href="https://us19.campaign-archive.com/home/?u=a9af83af1f247ecc04f50ad46&id=f3e092d65e"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClasses}
          >
            Newsletter
          </a>
          <a
            href="https://uli-community.tattle.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClasses}
          >
            Uli Community
          </a>
          <Link to="/research" className={linkClasses}>
            Research
          </Link>
          <Link to="/blog" className={linkClasses}>
            Blog
          </Link>
          <Link to="/privacy-policy" className={linkClasses}>
            Privacy Policy
          </Link>
          <Link to="/sitemap" className={linkClasses}>
            Sitemap
          </Link>
        </div>
      </div>
    </div>
  );
}
