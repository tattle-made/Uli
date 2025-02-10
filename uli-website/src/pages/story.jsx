import React from "react";
import { Box, Text, Button } from "grommet";
import AppShell from "../components/molecules/AppShell";
import { useState } from "react";

export default function Story() {
  const [highlight, setHighlight] = useState(false);
  const [hoveredSlur, setHoveredSlur] = useState(null);

  const slurs = [
    {
      name: "slur1",
      metadata: {
        levelOfSeverity: "low",
        casual: "yes",
        appropriated: "No",
        meaning: "Test Slur",
        categories: ["other"],
      },
    },
  ];

  const text =
    "Lorem ipsum dolor sit slur1 consectetur adipisicing elit. peat slur1 placeat perferendis nam at impedit slur3 neque officia quas magni non, aliquam laboriosam adipisci esse animi, ut ipsum. Et slur1 necessitatibus veniam animi debitis slur2 eius fuga iusto omnis placeat nam ipsa modi at, facilis doloremque, quibusdam slur4 incidunt, nihil enim consectetur quo unde quasi. Sint voluptas error aspernatur fugit itaque molestiae pariatur slur3 aliquid ea consequuntur quam quasi officiis enim, ullam laboriosam explicabo mollitia in slur2 nulla excepturi perferendis. Saepe nesciunt minima voluptate exercitationem voluptatum vel slur4 vero corporis fuga, a minus facere odio culpa. Cupiditate delectus cum magni quia aliquam voluptatum quibusdam dicta deleniti, asperiores ut molestiae ab expedita slur1 vero, sequi quae aut maiores. Porro, est. Explicabo hic alias doloribus modi reprehenderit. Pariatur tempora vero tenetur facere enim omnis slur1 quaerat molestias slur4 minus. Corporis, consectetur provident. Aut minus numquam aspernatur eaque eligendi temporibus porro, obcaecati laboriosam voluptatum vitae velit, dicta totam, adipisci accusamus maiores! Sequi dolores necessitatibus slur3 error pariatur nesciunt unde est, commodi sapiente iste accusantium eaque doloremque possimus incidunt nostrum deserunt adipisci enim placeat quos facere earum, voluptatum officiis inventore? Impedit, modi quos nam, voluptates eos nobis a totam blanditiis repudiandae hic tenetur vel autem?";

  const getHighlightedText = (text, words) => {
    if (!highlight) return text;

    const regex = new RegExp(
      `\\b(${words.map((w) => w.name).join("|")})\\b`,
      "gi"
    );

    return text.split(regex).map((part, index) => {
      const wordData = words.find(
        (w) => w.name.toLowerCase() === part.toLowerCase()
      );

      return wordData ? (
        <span
          key={index}
          style={{
            backgroundColor: "#ffde2155",
            boxShadow: "0px 0px 5px #ffde21",
            cursor: "pointer",

            display: "inline",
            whiteSpace: "pre-wrap",
          }}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            // console.log("SLUR POSITION: ", { x: rect.left, y: rect.bottom })

            const screenHeight = window.innerHeight;
            const screenWidth = window.innerWidth;

            const spaceBelow = screenHeight - rect.bottom;

            let position = { x: rect.left, y: rect.bottom + 10 };

            console.log("SPACE BELOW: ", spaceBelow);

            if (spaceBelow < 300) {
              position = { x: rect.left, y: rect.top - 210 };
            }

            if (position.x + 290 > screenWidth) {
              position.x = screenWidth - 320;
            }

            setHoveredSlur({ metadata: wordData.metadata, position });
          }}
          onMouseLeave={() => setHoveredSlur(null)}
        >
          {part}
        </span>
      ) : (
        part
      );
    });
  };

  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        <Box align="left" width={"large"}>
          <Button
            color={highlight ? "#ede09f" : "lightGrey"}
            primary
            onClick={() => setHighlight(!highlight)}
            label={highlight ? "Turn Off" : "Turn On"}
            style={{ width: "fit-content" }}
          />
        </Box>
        <Box width={"large"}>
          <p>{getHighlightedText(text, slurs)}</p>
          {hoveredSlur && (
            <div
              className="absolute"
              style={{
                position: "absolute",
                left: hoveredSlur.position.x,
                top: hoveredSlur.position.y + 10,
              }}
            >
              <HoverSlurMetadata slurDetails={hoveredSlur.metadata} />
            </div>
          )}
        </Box>
      </Box>
    </AppShell>
  );
}

const HoverCategoryBubble = ({ data }) => {
  return (
    <Box>
      <Box
        round="small"
        background="#FADA5E"
        pad="xsmall"
        width="fit-content"
        wrap={true}
        style={{
          fontFamily: "Raleway",
          fontSize: "9px",
          color: "black",
        }}
      >
        <Text size="small">{data}</Text>
      </Box>
    </Box>
  );
};

const HoverSlurMetadata = ({ slurDetails }) => {
  return (
    <Box
      pad="small"
      background="antiquewhite"
      border={{ color: "black", size: "xsmall" }}
      round="small"
      width="18rem"
      justify="start"
      align="start"
      elevation="small"
      style={{
        fontFamily: "Raleway",
        fontSize: "9px",
        color: "black",
        textAlign: "left",
        lineHeight: "1.5",
        minWidth: "288px",
      }}
    >
      {slurDetails["levelOfSeverity"] && (
        <Text>
          <b>Level of Severity:</b> {slurDetails["levelOfSeverity"]}
        </Text>
      )}
      {slurDetails["casual"] && (
        <Text>
          <b>Casual:</b> {slurDetails["casual"]}
        </Text>
      )}
      {slurDetails["appropriated"] && (
        <Text>
          <b>Appropriated:</b> {slurDetails["appropriated"]}
        </Text>
      )}
      {slurDetails["appropriationContext"] && (
        <Text>
          <b>If, Appropriated, Is it by Community or Others?:</b>{" "}
          {slurDetails["appropriationContext"]}
        </Text>
      )}
      {slurDetails["meaning"] && (
        <Text>
          <b>What Makes it Problematic?:</b> {slurDetails["meaning"]}
        </Text>
      )}

      {slurDetails["categories"] && slurDetails["categories"].length > 0 && (
        <Box>
          <Text>
            <b>Categories:</b>
          </Text>
          <Box direction="row" gap="xsmall" cssGap wrap>
            {slurDetails["categories"].map((category, index) => (
              <HoverCategoryBubble
                key={index}
                data={category.replace(/_/g, " ")}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
