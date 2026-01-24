
import { db } from "../../firebase/config";
import { useAuthentication } from "../../hooks/useAuthentication";
import styles from "./Register.module.css";
import { useState, useEffect } from "react";

const Register = () => {
	const [displayName, setDisplayName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const { createUser, error: authError, loading } = useAuthentication();

	const handleSubmit = async (e) => {
		e.preventDefault();

		setError("");

		const user = {
			displayName,
			email,
			password,
		};

		if (password !== confirmPassword) {
			setError("Passwords must match!");
			return;
		}

		const res = await createUser(user);

		console.log(res);
	};

	useEffect(()=> {
		if(authError)
			setError(authError)
	}, [authError])

	return (
		<div className={styles.register}>
			<h1>Sign-in to post</h1>
			<p>Create your user and share your stories!</p>
			<form onSubmit={handleSubmit}>
				<label>
					<span>Name:</span>
					<input
						type="text"
						name="displayName"
						placeholder="User name"
						required
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
					/>
				</label>
				<label>
					<span>E-mail:</span>
					<input
						type="email"
						name="email"
						placeholder="User e-mail"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</label>
				<label>
					<span>Password:</span>
					<input
						type="password"
						name="password"
						placeholder="Type your password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>
				<label>
					<span>Password confirmation:</span>
					<input
						type="password"
						name="confirmPassword"
						placeholder="Confirm your password"
						required
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</label>
				{!loading && <button className="btn">Sign-In</button>}
				{loading && <button className="btn" disabled>Wait...</button>}
				{error && <p className="error">{error}</p>}
			</form>
		</div>
	);
};

export default Register;
