import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

// collection represents an entity in Firebase like a table in MySQL

const initalState = {
	loading: null,
	error: null,
};

const deleteReducer = (state, action) => {
	console.log("REDUCER", action);
	switch (action.type) {
		case "LOADING":
			return { loading: true, error: null };
		case "DELETED_DOC":
			return { loading: false, error: null };
		case "ERROR":
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const useDeleteDocument = (docCollection) => {
	const [response, dispatch] = useReducer(deleteReducer, initalState);

	// deal with memory leak
	const [canceled, setCanceled] = useState(false);
	const checkCancelBeforeDispatch = (action) => {
		if (canceled) return;
		dispatch(action);
	};

	const deleteDocument = async (id) => {
		checkCancelBeforeDispatch({ type: "LOADING" });

		try {
			const deleteDocument = await deleteDoc(doc(db, docCollection, id));

			checkCancelBeforeDispatch({
				type: "DELETED_DOC",
				payload: deleteDocument,
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

	return { deleteDocument, response };
};
