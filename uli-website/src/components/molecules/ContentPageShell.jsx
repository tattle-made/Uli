import React from "react";
import AppShell from "./AppShell";
import { Box, Text } from "grommet";
import { MDXProvider } from "@mdx-js/react";
import styled from "styled-components";
import CustomCodeBlock from "./codeSnippet";

/**
 * =====================================================================
 * Figma Design Tokens (node 388-265) — sizes reduced 20% from original
 * =====================================================================
 *
 * Page Title:   Labrada SemiBold  51px (was 64), line-height 110%, tracking -0.05em
 * Date:         Labrada Regular   16px (was 20), line-height 120%
 * Author:       Labrada Bold      16px (was 20), line-height 120%
 *
 * h2 Section:   Labrada ExtraBold 38px (was 48), line-height 150%
 * h3 SubSec:    Labrada SemiBold  32px (was 40), line-height 150%
 * h4:           IBM Plex Sans Bold 19px (was 24), line-height 160%
 * h5:           IBM Plex Sans Reg  19px (was 24), line-height 160%
 *
 * Body (p):     IBM Plex Sans Reg 16px (was 20), line-height 175%
 * Blockquote:   Labrada Regular   19px (was 24), line-height 134%
 * Link:         IBM Plex Sans SB  16px (was 20), underline
 * List Item:    IBM Plex Sans     16px (was 20), line-height 175%
 * Code:         IBM Plex Mono Reg 16px (was 20), line-height 134%
 *
 * Header BG:    #2d2d2d
 * Header text:  #fdf6ed (cream)
 * Page BG:      #fdf6ed
 * Text:         #212121
 * Accent:       #de8821
 * Header pad:   80px top/bottom, 160px left/right
 * Section gap:  80px
 * =====================================================================
 */

// ── Google Fonts ───────────────────────────────────────────────────────

const FontLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=Eczar:wght@500;600&family=IBM+Plex+Mono:wght@400&family=IBM+Plex+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Labrada:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
    rel="stylesheet"
  />
);

// ── Blog Header (dark background) ─────────────────────────────────────

const HeaderWrapper = styled.div`
  width: 100%;
  background-color: #FFE7D9;
  padding: 64px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 80px 160px;
  }
`;

const PageTitle = styled.h1`
  font-family: "Labrada", serif;
  font-weight: 600;
  font-size: 38px;
  line-height: 110%;
  letter-spacing: -0.05em;
  text-align: center;
  color: #212121;
  margin: 0 0 12px 0;
  max-width: 800px;

  @media (min-width: 768px) {
    font-size: 51px;
  }
`;

const MetaDate = styled.p`
  font-family: "Labrada", serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #212121;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const MetaAuthor = styled.p`
  font-family: "Labrada", serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #212121;
  margin: 4px 0 0 0;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

// ── Simple title header (cream bg, no metadata) ───────────────────────

const SimpleTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
  padding-top: 16px;
`;

const SimpleTitleText = styled.h1`
  font-family: "Labrada", serif;
  font-weight: 400;
  font-size: 32px;
  line-height: 105%;
  text-align: center;
  color: #212121;
  margin: 0 0 16px 0;

  @media (min-width: 768px) {
    font-size: 51px;
  }
`;

const DecorativeBorder = styled.div`
  width: 100%;
  border-bottom: 21px solid transparent;
  border-image-source: url("/ResourceBorder.png");
  border-image-slice: 33%;
  border-image-repeat: round;
`;

// ── Heading components ─────────────────────────────────────────────────

const SectionOpening = styled.h2`
  font-family: "Labrada", serif;
  font-weight: 800;
  font-size: 24px;
  line-height: 100%;
  color: #212121;
  margin: 48px 0 12px 0;

  @media (min-width: 768px) {
    font-size: 38px;
  }
`;

const SubSectionOpening = styled.h3`
  font-family: "Labrada", serif;
  font-weight: 600;
  font-size: 22px;
  line-height: 175%;
  color: #212121;
  margin: 40px 0 10px 0;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const SubSubSection = styled.h4`
  font-family: "Labrada", serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 160%;
  color: #212121;
  margin: 32px 0 8px 0;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const SubSubSubSection = styled.h5`
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 160%;
  color: #212121;
  margin: 28px 0 8px 0;

  @media (min-width: 768px) {
    font-size: 19px;
  }
`;

const H6Section = styled.h6`
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 160%;
  color: #212121;
  margin: 28px 0 8px 0;

  @media (min-width: 768px) {
    font-size: 19px;
  }
`;

// ── Body components ────────────────────────────────────────────────────

const BodyText = styled.p`
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 175%;
  color: #212121;
  margin: 0 0 16px 0;
  word-break: break-word;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const StyledLink = styled.a`
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 600;
  font-size: inherit;
  color: #b44e0f;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  border-radius: 2px;
  padding: 0 2px;
  margin: 0 -2px;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #f28948;
    background-color: rgba(242, 137, 72, 0.1);
    text-decoration-thickness: 2px;
  }
  &:visited {
    color: #b44e0f;
  }
`;

const BlockquoteStyled = styled.blockquote`
  font-family: "Labrada", serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 134%;
  color: #b44e0f;
  margin: 24px 0;
  padding-left: 20px;
  border-left: 4px dashed #ff8d55;
  font-style: normal;

  @media (min-width: 768px) {
    font-size: 19px;
    padding-left: 30px;
  }
`;

const UnorderedList = styled.ul`
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 14px;
  line-height: 175%;
  color: #212121;
  margin: 0 0 16px 0;
  padding-left: 0;
  list-style-type: none;

  @media (min-width: 768px) {
    font-size: 16px;
  }

  & > li {
    position: relative;
    padding-left: 32px;
    padding-top: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }

  & > li:last-child {
    border-bottom: none;
  }

  & > li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px; /* Alignment adjustment */
    width: 16px;
    height: 28px;
    background-image: url("data:image/svg+xml;utf8,<svg preserveAspectRatio='none' width='100%' height='100%' overflow='visible' style='display:block;' viewBox='0 0 18 35' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M7.97768 12.55C7.04018 12.0083 6.87351 11.3 7.47768 10.425C8.06101 10.5292 8.60268 10.8625 9.10268 11.425C9.68601 10.6125 10.3943 10.4042 11.2277 10.8C11.2068 11.5083 10.9152 12.0917 10.3527 12.55C11.5818 14.425 11.3735 15.05 9.72768 14.425L8.97768 13.925C8.64435 14.5083 8.14435 14.7583 7.47768 14.675C6.95685 14.1125 7.12351 13.4042 7.97768 12.55ZM12.4777 17.4875C11.6235 16.8625 11.4152 16.1125 11.8527 15.2375C12.4568 15.3 13.0818 15.5917 13.7277 16.1125C14.0818 15.6333 14.6235 15.3417 15.3527 15.2375C15.7902 16.0292 15.5818 16.7792 14.7277 17.4875C15.7277 18.1333 15.8527 18.8 15.1027 19.4875C14.5193 19.4042 13.9777 19.1125 13.4777 18.6125C13.186 19.1333 12.686 19.4667 11.9777 19.6125C11.3943 18.8208 11.561 18.1125 12.4777 17.4875ZM8.10268 17.55C7.16518 16.9667 6.99851 16.2167 7.60268 15.3C8.18601 15.425 8.68601 15.7583 9.10268 16.3L10.6027 15.3L11.3527 15.8C11.2693 16.4667 10.936 17.05 10.3527 17.55C11.061 18.05 11.311 18.675 11.1027 19.425C10.5818 19.7375 10.1235 19.6542 9.72768 19.175L9.10268 18.8C8.83185 19.2792 8.41518 19.5708 7.85268 19.675C6.93601 19.1542 7.01935 18.4458 8.10268 17.55ZM4.41518 16.6125L5.66518 15.6125C6.81101 16.0917 6.81101 16.8417 5.66518 17.8625C6.20685 18.2583 6.54018 18.8417 6.66518 19.6125C5.97768 20.1125 5.22768 19.9458 4.41518 19.1125C3.93601 19.9042 3.26935 20.0708 2.41518 19.6125C2.51935 18.925 2.85268 18.3 3.41518 17.7375C2.62351 17.2792 2.41518 16.6125 2.79018 15.7375C3.45685 15.7167 3.99851 16.0083 4.41518 16.6125ZM8.47768 22.55C7.66518 21.8208 7.54018 21.0708 8.10268 20.3C8.68601 20.425 9.18601 20.7583 9.60268 21.3C10.1443 20.4667 10.8527 20.2583 11.7277 20.675C11.7068 21.3208 11.4152 21.8625 10.8527 22.3C11.0402 22.7583 11.3735 23.2167 11.8527 23.675C11.6027 24.675 11.061 24.8417 10.2277 24.175L9.60268 23.675C9.26935 24.2375 8.72768 24.5292 7.97768 24.55C7.35268 23.8417 7.51935 23.175 8.47768 22.55Z' fill='%23F28948'/></svg>");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center top;
  }
`;

const OrderedList = styled.ol`
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 14px;
  line-height: 175%;
  color: #212121;
  margin: 0 0 16px 0;
  padding-left: 0;
  list-style-type: none;
  counter-reset: custom-counter;

  @media (min-width: 768px) {
    font-size: 16px;
  }

  & > li {
    counter-increment: custom-counter;
    position: relative;
    padding-left: 32px;
    padding-top: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }

  & > li:last-child {
    border-bottom: none;
  }

  & > li::before {
    content: counter(custom-counter);
    position: absolute;
    left: 0;
    top: 8px;
    width: 18px;
    font-weight: 700;
    color: #ff8d55;
    text-align: center;
  }
`;

const ListItem = styled.li`
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 400;
  margin-bottom: 6px;
  word-break: break-word;
`;

const HorizontalRule = styled.hr`
  border: none;
  border-top: 2px solid #de8821;
  margin: 40px 0;
`;

const CodeBlock = styled.pre`
  font-family: "IBM Plex Mono", monospace;
  font-weight: 400;
  font-size: 14px;
  line-height: 134%;
  background: #ffe7d9;
  color: #000000;
  padding: 20px 30px;
  border-radius: 0;
  border-left: 4px solid #ff8d55;
  overflow-x: auto;
  margin: 16px 0;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const InlineCode = styled.code`
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.875em;
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 3px;
`;

const StrongText = styled.strong`
  font-weight: 700;
`;

const EmText = styled.em`
  font-style: italic;
`;

// ── MDX component map ──────────────────────────────────────────────────

const StyledDetails = styled.details`
  border: 1px solid #212121;
  width: 100%;
  max-width: 660px;
  background-color: transparent;
  margin: 12px 0 24px 0;
  transition: all 0.3s ease;
  
  &[open] {
    background-color: #fff6e8;
  }

  & > ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  & > ul > li {
    padding: 16px 20px;
    border-top: 1px solid rgba(0,0,0,0.1);
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 175%;
    color: #212121;
    margin-bottom: 0;

    &::before {
      display: none;
    }

    @media (min-width: 768px) {
      font-size: 16px;
    }
  }

  & > ul > li > p {
    margin: 0;
  }

  &[open] summary ~ * {
    animation: fadeInSlideDown 0.3s ease-out;
  }

  @keyframes fadeInSlideDown {
    0% {
      opacity: 0;
      transform: translateY(-8px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledSummary = styled.summary`
  padding: 16px 20px;
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  list-style: none; /* Modern browsers */
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.2;
  color: #212121;
  transition: background-color 0.2s ease, opacity 0.2s ease;

  @media (min-width: 768px) {
    font-size: 19px;
  }

  &:hover {
    background-color: rgba(33, 33, 33, 0.04);
  }

  &::-webkit-details-marker {
    display: none; /* Safari */
  }

  &::after {
    content: '';
    display: block;
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'><path d='M19 9L12 16L5 9' stroke='%23212121' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>");
    background-repeat: no-repeat;
    background-position: center;
    transition: transform 0.3s ease-in-out;
  }

  details[open] & {
    font-weight: 700;
  }

  details[open] &::after {
    transform: rotate(180deg);
  }
`;

const mdxComponents = {
  h1: (props) => <SectionOpening as="h1" {...props} />,
  h2: (props) => <SubSectionOpening {...props} />,
  h3: (props) => <SubSubSection {...props} />,
  h4: (props) => <SubSubSubSection {...props} />,
  h5: (props) => <H6Section {...props} />,
  h6: (props) => <H6Section {...props} />,
  p: (props) => <BodyText {...props} />,
  a: (props) => (
    <StyledLink target="_blank" rel="noopener noreferrer" {...props} />
  ),
  blockquote: (props) => <BlockquoteStyled {...props} />,
  ul: (props) => <UnorderedList {...props} />,
  ol: (props) => <OrderedList {...props} />,
  li: (props) => <ListItem {...props} />,
  hr: (props) => <HorizontalRule {...props} />,
  pre: (props) => <CodeBlock {...props} />,
  code: (props) => {
    if (props.className) {
      return <CustomCodeBlock {...props} />;
    }
    return <InlineCode {...props} />;
  },
  strong: (props) => <StrongText {...props} />,
  em: (props) => <EmText {...props} />,
  Details: (props) => <StyledDetails {...props} />,
  Summary: (props) => <StyledSummary {...props} />,
};

// ── Date formatter ─────────────────────────────────────────────────────

function formatDate(input) {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d.getTime())) return String(input);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Main component ─────────────────────────────────────────────────────

const ContentPageShell = (props) => {
  const { children } = props;
  const frontmatter = props.pageContext?.frontmatter || {};
  const { name, author, date, title } = frontmatter;

  const hasMetadata = !!(author || date);
  const displayTitle = name || title;

  return (
    <AppShell>
      <FontLink />
      <Box align="center">
        <MDXProvider components={mdxComponents}>
          {/* ── Blog header with dark background ── */}
          {hasMetadata && (
            <HeaderWrapper>
              {displayTitle && <PageTitle>{displayTitle}</PageTitle>}
              {date && <MetaDate>{formatDate(date)}</MetaDate>}
              {author && <MetaAuthor>{author}</MetaAuthor>}
            </HeaderWrapper>
          )}

          {/* ── Simple title (no metadata) ── */}
          {!hasMetadata && displayTitle && (
            <SimpleTitleWrapper>
              <SimpleTitleText>{displayTitle}</SimpleTitleText>
              <DecorativeBorder />
            </SimpleTitleWrapper>
          )}

          <Box width={"large"} pad={{ horizontal: "medium", bottom: "large" }}>
            {children}
          </Box>
        </MDXProvider>
      </Box>
    </AppShell>
  );
};

export default ContentPageShell;
