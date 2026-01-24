import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	signOut,
} from "firebase/auth";

import { useState, useEffect } from "react";

export const useAuthentication = () => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(null);

	//cleanup
	// deal with memory leak
	const [canceled, setCanceled] = useState(false);

	const auth = getAuth();

	function checkIfIsCanceled() {
		if (canceled) return;
	}

	useEffect(() => {
		return () => setCanceled(true);
	}, []);

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

	return { auth, createUser, error, loading };
};
