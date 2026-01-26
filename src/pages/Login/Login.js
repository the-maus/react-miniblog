import styles from "./Login.module.css";

import { db } from "../../firebase/config";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useState, useEffect } from "react";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const { login, error: authError, loading } = useAuthentication();

	const handleSubmit = async (e) => {
		e.preventDefault();

		setError("");

		const user = {
			email,
			password,
		};

		const res = await login(user);

		console.log(res);
	};

	useEffect(() => {
		if (authError) setError(authError);
	}, [authError]);

	return (
		<div className={styles.login}>
			<h1>Login</h1>
			<p>Login in order to use the dashboard</p>
			<form onSubmit={handleSubmit}>
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
				{!loading && <button className="btn">Login</button>}
				{loading && (
					<button className="btn" disabled>
						Wait...
					</button>
				)}
				{error && <p className="error">{error}</p>}
			</form>
		</div>
	);
};

export default Login;
