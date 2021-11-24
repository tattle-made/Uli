import React, { useContext } from "react";
import { ResponsiveContext, Box, Heading } from "grommet";
import { Link, PlainLink } from "./TattleLinks";

const TattleLogo = ({ data, theme, brandName }) => {
	const fill = data && data.fill ? data.fill : "#E76D67";
	const scale = data && data.scale ? data.scale : 1;
	const size = useContext(ResponsiveContext);

	const LogoSVG = () => (
		<PlainLink to={"/"}>
			<Heading level={3} margin={"none"} color={"brand"}>
				{brandName}
			</Heading>
		</PlainLink>
	);
	return (
		<Box>
			<LogoSVG />
		</Box>
	);
};

export default TattleLogo;
