import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";

// collection represents an entity in Firebase like a table in MySQL

const initalState = {
	loading: null,
	error: null,
};

const updateReducer = (state, action) => {
	console.log("REDUCER", action);
	switch (action.type) {
		case "LOADING":
			return { loading: true, error: null };
		case "UPDATED_DOC":
			return { loading: false, error: null };
		case "ERROR":
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const useUpdateDocument = (docCollection) => {
	const [response, dispatch] = useReducer(updateReducer, initalState);

	// deal with memory leak
	const [canceled, setCanceled] = useState(false);
	const checkCancelBeforeDispatch = (action) => {
		if (canceled) return;
		dispatch(action);
	};

	const updateDocument = async (id, data) => {
		checkCancelBeforeDispatch({ type: "LOADING" });

		try {
			const docRef = await doc(db, docCollection, id);
			const updatedDocument = await updateDoc(docRef, data);

			checkCancelBeforeDispatch({
				type: "UPDATED_DOC",
				payload: updatedDocument,
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

	return { updateDocument, response };
};
