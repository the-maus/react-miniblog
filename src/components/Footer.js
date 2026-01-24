import styles from "./Footer.module.css";

const Footer = () => {
	return <footer className={styles.footer}>
		<h3>Write about your interests!</h3>
		<p>Mini Blog &copy; {new Date().getFullYear()}</p>
	</footer>;
};

export default Footer;
