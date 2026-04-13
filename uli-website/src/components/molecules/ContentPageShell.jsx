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
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&family=IBM+Plex+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Labrada:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
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
`;

const MetaAuthor = styled.p`
  font-family: "Labrada", serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 120%;
  text-align: center;
  color: #212121;
  margin: 4px 0 0 0;
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
  border-bottom: 16px solid transparent;
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
  line-height: 150%;
  color: #212121;
  margin: 40px 0 10px 0;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const SubSubSection = styled.h4`
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 160%;
  color: #212121;
  margin: 32px 0 8px 0;

  @media (min-width: 768px) {
    font-size: 19px;
  }
`;

const SubSubSubSection = styled.h5`
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
  color: #de8821;
  text-decoration: underline;
  text-underline-offset: 2px;
  word-break: break-all;
  transition: color 0.15s ease;

  &:hover {
    color: #212121;
  }
  &:visited {
    color: #de8821;
  }
`;

const BlockquoteStyled = styled.blockquote`
  font-family: "Labrada", serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 134%;
  color: #212121;
  margin: 24px 0;
  padding-left: 20px;
  border-left: 4px solid #de8821;
  font-style: italic;

  @media (min-width: 768px) {
    font-size: 19px;
  }
`;

const UnorderedList = styled.ul`
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 14px;
  line-height: 175%;
  color: #212121;
  margin: 0 0 16px 0;
  padding-left: 24px;
  list-style-type: disc;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const OrderedList = styled.ol`
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 14px;
  line-height: 175%;
  color: #212121;
  margin: 0 0 16px 0;
  padding-left: 24px;
  list-style-type: decimal;

  @media (min-width: 768px) {
    font-size: 16px;
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
  background: #2d2d2d;
  color: #f5f5f5;
  padding: 20px;
  border-radius: 6px;
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

const mdxComponents = {
  h1: (props) => <SectionOpening as="h1" {...props} />,
  h2: (props) => <SectionOpening {...props} />,
  h3: (props) => <SubSectionOpening {...props} />,
  h4: (props) => <SubSubSection {...props} />,
  h5: (props) => <SubSubSubSection {...props} />,
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
