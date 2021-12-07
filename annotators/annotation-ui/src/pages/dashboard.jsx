import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
// import ReactJson from "react-json-view";
import { Trans, useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Grommet, Box, Heading, Text, Button, Header, Footer } from "grommet";
import TattleTheme from "../components/atoms/Theme";
import axios from "axios";
import { config } from "../components/config";
import TattleLogo from "../components/atoms/TattleLogo";
import fileDownload from "js-file-download";

const preference = {
	language: "en",
};

const IndexPage = () => {
	const { t } = useTranslation();
	const { languages, changeLanguage } = useI18next();
	const [dashboard, setDashboard] = useState(undefined);

	useEffect(() => {
		changeLanguage(preference.language);
	}, []);

	useEffect(() => {
		async function getData() {
			const { data } = await axios.get(
				`${config.api_endpoint}/dashboard`
			);
			// console.log(data);
			const simpleDash = {};
			data.status.map((item) => {
				if (simpleDash[item.username] == undefined) {
					simpleDash[item.username] = {};
				}
				simpleDash[item.username][item.status] = item.count;
			});
			setDashboard(simpleDash);
			console.log(simpleDash);
		}
		getData();
	}, []);

	async function downloadAnnotations() {
		const { data } = await axios.get(
			`${config.api_endpoint}/annotations/type/csv`
		);
		fileDownload(JSON.stringify(data), "annotations.json");
	}

	return (
		<Grommet full theme={TattleTheme}>
			<Box fill gap={"small"}>
				<Header pad={"small"}>
					<TattleLogo />
				</Header>

				<Box flex={"grow"} gap={"medium"}>
					<Box
						width={"large"}
						direction={"column"}
						gap={"large"}
						alignSelf={"center"}
					>
						<Text>Dashboard </Text>
						{/* <ReactJson collapsed={false} src={dashboard} /> */}
						<Box
							width={"large"}
							round={"small"}
							responsive
							background={"visuals-1"}
							pad={"medium"}
							alignSelf={"center"}
						>
							{dashboard ? (
								<Box>
									{Object.keys(dashboard).map((username) => (
										<Text>
											{username +
												" : " +
												dashboard[username].pending +
												" : " +
												dashboard[username].completed}
										</Text>
									))}
								</Box>
							) : null}
						</Box>
						<Button
							primary
							label={"Download"}
							onClick={downloadAnnotations}
						/>
					</Box>
				</Box>

				<Footer pad="medium">
					<Text size={"xsmall"}>
						Built by CIS and Tattle with support from ONI
					</Text>
				</Footer>
			</Box>
		</Grommet>
	);
};

export default IndexPage;

export const query = graphql`
	query ($language: String!) {
		locales: allLocale(filter: { language: { eq: $language } }) {
			edges {
				node {
					ns
					data
					language
				}
			}
		}
	}
`;
