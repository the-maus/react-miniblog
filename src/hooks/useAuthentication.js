import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	signOut,
} from "firebase/auth";
import { app } from "../firebase/config";
import { useState, useEffect } from "react";

export const useAuthentication = () => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(null);

	//cleanup
	// deal with memory leak
	const [canceled, setCanceled] = useState(false);

	const auth = getAuth(app);

	function checkIfIsCanceled() {
		if (canceled) return;
	}

	useEffect(() => {
		return () => setCanceled(true);
	}, []);

	// register
	const createUser = async (data) => {
		checkIfIsCanceled();

		setLoading(true);
		setError("");

		try {
			const { user } = await createUserWithEmailAndPassword(
				auth,
				data.email,
				data.password,
			);

			await updateProfile(user, { displayName: data.displayName });

			setLoading(false);

			return user;
		} catch (error) {
			console.log(error.message);
			console.log(typeof error);

			let systemErrorMessage;

			if (error.message.includes("Password")) {
				systemErrorMessage =
					"Password must have at least 6 characters!";
			} else if (error.message.includes("email-already")) {
				systemErrorMessage = "E-mail already registered!";
			} else {
				systemErrorMessage =
					"An error has occurred, please try again later!";
			}

			setError(systemErrorMessage);
		}

		setLoading(false);
	};

	// logout
	const logout = () => {
		checkIfIsCanceled();
		signOut(auth);
	};

	// login
	const login = async (data) => {
		checkIfIsCanceled();

		setLoading(true);
		setError(false);

		try {
			await signInWithEmailAndPassword(auth, data.email, data.password);
			setLoading(false);
		} catch (error) {
			let systemErrorMessage;

			if (error.message.includes("user-not-found")) {
				systemErrorMessage = "User not found.";
			} else if (error.message.includes("wrong-password")) {
				systemErrorMessage = "Wrong password.";
			} else {
				systemErrorMessage =
					"An error has occurred, please try again later!";
			}

			console.log(error);

			setError(systemErrorMessage);
			setLoading(false);
		}
	};

	return { auth, createUser, error, loading, logout, login };
};
