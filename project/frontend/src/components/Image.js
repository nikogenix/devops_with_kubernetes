const Image = () => {
	const image = process.env.REACT_APP_IMAGE_URL || "http://localhost:4000/image.jpg";

	// eslint-disable-next-line jsx-a11y/img-redundant-alt
	return <img src={image} alt="random daily image" />;
};

export default Image;
