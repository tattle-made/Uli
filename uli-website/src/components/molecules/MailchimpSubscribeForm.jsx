import React, { useState } from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe";

const MAILCHIMP_URL =
  "https://tattle.us19.list-manage.com/subscribe/post?u=a9af83af1f247ecc04f50ad46&amp;id=f3e092d65e&amp;f_id=00e1bbe7f0";

const ARCHIVE_URL =
  "https://us19.campaign-archive.com/home/?u=a9af83af1f247ecc04f50ad46&id=f3e092d65e";

export default function MailchimpSubscribeForm() {
  const [email, setEmail] = useState("");

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[813px] flex flex-col items-center justify-center px-4 md:px-10 gap-6">
        {/* Title */}
        <h2 className="font-['MixStitch'] font-medium text-[48px] sm:text-[64px] leading-tight text-center text-white m-0 tracking-wide">
          Stay Updated
        </h2>

        {/* Subtitle */}
        <p className="font-labrada font-normal text-[18px] sm:text-[20px] leading-[24px] text-[#fff6e8] text-center max-w-[733px] m-0">
          Get Ulis’ latest work and dispatches in your inbox.
        </p>

        {/* Newsletter Signup Form Container */}
        <div className="w-full max-w-[645px] flex flex-col gap-2 mt-2">
          <MailchimpSubscribe
            url={MAILCHIMP_URL}
            render={({ subscribe, status, message }) => {
              const isSending = status === "sending";
              const isSuccess = status === "success";
              const isError = status === "error";

              return (
                <div className="w-full flex flex-col gap-2">
                  {/* Email input bar with Subscribe button */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (email && email.trim()) {
                        subscribe({ EMAIL: email.trim() });
                      }
                    }}
                    className="bg-[#fff8ed] flex items-center justify-between h-[66px] pl-[16px] sm:pl-[20px] pr-[8px] py-[8px] gap-3 sm:gap-4 w-full shadow-sm"
                  >
                    {/* Mail Icon */}
                    <div className="shrink-0 w-[28px] h-[28px] sm:w-[34px] sm:h-[34px] flex items-center justify-center">
                      <svg
                        className="w-full h-full text-[#2D2D2D] fill-current"
                        viewBox="0 0 34 34"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M8.5 11.3333H11.3333V14.1667H8.5V11.3333ZM11.3333 14.1667H14.1667V17H11.3333V14.1667ZM25.5 11.3333H22.6667V14.1667H25.5V11.3333ZM22.6667 14.1667H19.8333V17H22.6667V14.1667ZM14.1667 17H19.8333V19.8333H14.1667V17ZM2.83333 8.5H5.66667V25.5H2.83333V8.5ZM28.3333 8.5H31.1667V25.5H28.3333V8.5ZM5.66667 5.66667H28.3333V8.5H5.66667V5.66667ZM5.66667 25.5H28.3333V28.3333H5.66667V25.5Z" />
                      </svg>
                    </div>

                    {/* Email Input Field */}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={isSending || isSuccess}
                      required
                      aria-label="Email address"
                      className="font-labrada font-normal text-[18px] sm:text-[20px] leading-[28px] text-[#2d2d2d] placeholder-[#57524a] bg-transparent border-none outline-none flex-1 min-w-0"
                    />

                    {/* Subscribe button */}
                    <button
                      type="submit"
                      disabled={isSending || isSuccess}
                      className="shrink-0 bg-[#ad521b] hover:bg-[#8e4215] active:bg-[#723410] disabled:opacity-70 transition-colors duration-200 h-[50px] px-4 sm:px-6 flex items-center justify-center cursor-pointer border-none"
                    >
                      <span className="font-labrada font-medium text-[18px] sm:text-[20px] leading-[28px] text-white whitespace-nowrap">
                        {isSending ? "Submitting..." : isSuccess ? "Subscribed!" : "Subscribe"}
                      </span>
                    </button>
                  </form>

                  {/* Status Messages */}
                  {isSuccess && (
                    <div className="bg-[#fff8ed]/10 border border-[#fff8ed]/30 text-[#fff8ed] p-3 text-center font-labrada text-[16px]">
                      Thank you! You have been subscribed to our dispatches.
                    </div>
                  )}

                  {isError && (
                    <div
                      className="bg-red-950/60 border border-red-400 text-red-200 p-3 text-center font-labrada text-[16px]"
                      dangerouslySetInnerHTML={{
                        __html:
                          typeof message === "string" && message
                            ? message
                            : "There was an error saving your email. Please try again later.",
                      }}
                    />
                  )}
                </div>
              );
            }}
          />

          {/* Read previous dispatches archive link */}
          <a
            href={ARCHIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Read previous dispatches"
            className="bg-[#0d0d0d] hover:bg-[#202020] active:bg-[#000000] transition-colors duration-200 flex items-center justify-center gap-[10px] h-[65px] w-full text-decoration-none no-underline group cursor-pointer"
          >
            <div className="shrink-0 w-[24px] h-[24px] flex items-center justify-center text-[#fff8ed]">
              <svg
                className="w-full h-full fill-current"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M8 2H20V4H8V2ZM6 4H8V20H6V4ZM20 4H22V20H20V4ZM4 20H20V22H4V20ZM2 11H4V20H2V11ZM4 9H6V11H4V9ZM10 6H18V8H10V6ZM10 10H18V12H10V10ZM10 8H12V10H10V8ZM16 8H18V10H16V8ZM10 13H18V15H10V13ZM10 16H14V18H10V16Z" />
              </svg>
            </div>
            <span className="font-labrada font-medium text-[16px] sm:text-[18px] leading-[26px] text-[#fff8ed] group-hover:underline whitespace-nowrap">
              Read Previous Dispatches
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
