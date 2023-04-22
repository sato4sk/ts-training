import { GetServerSideProps, NextPage } from "next";
import { useState, useEffect } from "react";
import styles from "./index.module.css";

type Image = {
	url: string
}

type Props = {
	initialImageUrl: string
}

const IndexPage: NextPage<Props> = ({initialImageUrl}) => {
	const [imageUrl, setImageUrl] = useState(initialImageUrl)
	const [loading, setLoading] = useState(false)

	const handleClick = async () => {
		setLoading(true)
		const image = await fetchImage()
		setImageUrl(image.url)
		setLoading(false)
	}

	return (
	<div className={styles.page}>
		<button
        onClick={handleClick}
        style={{
          backgroundColor: "#319795",
          border: "none",
          borderRadius: "4px",
          color: "white",
          padding: "4px 8px",
        }}
		>
			きょうのにゃんこ🐱
		</button>
		<div className={styles.frame}>{loading || <img src={imageUrl} className={styles.img} />}</div>
	</div>
	);
};
export default IndexPage;

export const getServerSideProps: GetServerSideProps = async () => {
	const image = await fetchImage()
	return {
		props: {
			initialImageUrl: image.url
		}
	}

}

const fetchImage = async (): Promise<Image> => {
	const res = await fetch("https://api.thecatapi.com/v1/images/search")
	const images = await res.json()
	if (!Array.isArray(images)) {
		throw new Error("Fail to fetch image")
	}
	const image = images[0]
	if (!isImage(image)) {
		throw new Error("Fail to fetch image")
	}
	return image
}

const isImage = (value: unknown): value is Image => {
	if (!value || typeof value !== "object") {
		return false
	}
	return "url" in value && typeof value.url === "string"
}