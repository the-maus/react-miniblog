import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// collection represents an entity in Firebase like a table in MySQL

const initalState = {
	loading: null,
	error: null,
};

const insertReducer = (state, action) => {
	console.log("REDUCER", action);
	switch (action.type) {
		case "LOADING":
			return { loading: true, error: null };
		case "INSERTED_DOC":
			return { loading: false, error: null };
		case "ERROR":
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const useInsertDocument = (docCollection) => {
	const [response, dispatch] = useReducer(insertReducer, initalState);

	// deal with memory leak
	const [canceled, setCanceled] = useState(false);
	const checkCancelBeforeDispatch = (action) => {
		if (canceled) return;
		dispatch(action);
	};

	const insertDocument = async (document) => {
		checkCancelBeforeDispatch({ type: "LOADING" });

		try {
			const newDocument = { ...document, createdAt: Timestamp.now() };
			const insertedDocument = await addDoc(
				collection(db, docCollection),
				newDocument,
			);

			checkCancelBeforeDispatch({
				type: "INSERTED_DOC",
				payload: insertedDocument,
			});
		} catch (error) {
			console.log(error, canceled);
			checkCancelBeforeDispatch({
				type: "ERROR",
				payload: error.message,
			});
		}
	};

	useEffect(() => {
		setCanceled(false);
		return () => setCanceled(true);
	}, []);

	return { insertDocument, response };
};
