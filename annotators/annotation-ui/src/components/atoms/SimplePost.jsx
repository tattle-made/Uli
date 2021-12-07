import React, { useEffect } from "react";
import { Box, Text, Image, Anchor, Video } from "grommet";
import { Clock, Alert, Checkmark } from "grommet-icons";

export function SimplePost({ post, annotationStatus }) {
	const transformedPost = {
		tweet: post.text,
		photos: post.photos
			.split(",")
			.map((photo) => photo.slice(1, photo.length - 1)),
		urls: post.urls.split(",").map((url) => url.slice(1, url.length - 1)),
		role: post.role,
	};

	return (
		<Box
			direction={"column"}
			round={"small"}
			responsive
			border={{
				color: "light-4",
			}}
			pad="medium"
			gap={"xsmall"}
			height={"medium"}
			overflow="scroll"
		>
			<Box direction={"row"} gap={"small"} align={"center"}>
				<Text color={"dark-4"}>{post.id}</Text>
				{annotationStatus === "pending" ? (
					<Clock size={"small"} color={"visuals-8"} />
				) : annotationStatus === "malformed" ? (
					<Alert size={"small"} color={"visuals-7"} />
				) : annotationStatus === "complete" ? (
					<Checkmark size={"small"} color={"visuals-6"} />
				) : null}
			</Box>
			<div>
				{transformedPost.tweet ? (
					<Text size={"medium"} weight={600}>
						{transformedPost.tweet}
					</Text>
				) : null}
			</div>

			<div>
				{transformedPost.urls && transformedPost.urls[0].length != 0 ? (
					<Box direction={"row-responsive"} gap={"small"}>
						{transformedPost.urls.map((url, ix) => (
							<Anchor key={ix} href={url} target={"_blank"}>
								{"link " + (ix + 1)}
							</Anchor>
							// <Text>{url}</Text>
						))}
					</Box>
				) : null}
			</div>
			{transformedPost.photos ? (
				<Box
					height={"small"}
					width={"small"}
					direction={"row-responsive"}
				>
					{transformedPost.photos.map((photo, ix) => (
						<Anchor href={photo} target={"_blank"}>
							<Box
								height={"small"}
								width={"small"}
								direction={"row-responsive"}
							>
								<Image
									key={ix}
									fit={"cover"}
									alignSelf={"start"}
									src={photo}
								/>
							</Box>
						</Anchor>
					))}
				</Box>
			) : null}
			{transformedPost.role === "gif" && transformedPost.photos ? (
				<Box
					height={"small"}
					width={"small"}
					direction={"row-responsive"}
				>
					{transformedPost.photos.map((photo, ix) => (
						<Box height={"large"} width={"large"}>
							<Video
								controls="over"
								fit="contain"
								controls={true}
								loop={true}
								autoPlay={true}
							>
								<source
									key="video"
									src={photo}
									type="video/mp4"
								/>
							</Video>
						</Box>
					))}
				</Box>
			) : null}
		</Box>
	);
}
