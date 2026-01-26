// CSS
import { Link } from "react-router-dom";
import styles from "./About.module.css";

const About = () => {
	return (
		<div className={styles.about}>
			<h2>
				About mini<span>Blog</span>
			</h2>
			<p>
				This project consists of a mini blog with React on front-end and
				Firebase on back-end.
			</p>
			<Link to="/posts/create" className="btn">
				Create post
			</Link>
		</div>
	);
};

export default About;
