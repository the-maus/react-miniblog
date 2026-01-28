import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
	collection,
	query,
	orderBy,
	onSnapshot,
	where,
} from "firebase/firestore";

export const useFetchDocuments = (docCollection, search = null, uid = null) => {
	const [documents, setDocuments] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(null);

	// deal with memory leak
	const [canceled, setCanceled] = useState(false);

	useEffect(() => {
		async function loadData() {
			if (canceled) return;

			setLoading(true);

			const collectionRef = await collection(db, docCollection);

			try {
				let q;
				// get all data from collection ordering by creation date
				if (search) {
					q = await query(
						collectionRef,
						where("tagsArray", "array-contains", search),
						orderBy("createdAt", "desc"),
					);
				} else if (uid) { // filter by user (creator)
					q = await query(
						collectionRef,
						where("uid", "==", uid),
						orderBy("createdAt", "desc"),
					);
				} else {
					q = await query(
						collectionRef,
						orderBy("createdAt", "desc"),
					);
				}

				// gets the updated docs and adds an object to documents with id that comes separated from the other data on firebase
				await onSnapshot(q, (querySnapshot) => {
					setDocuments(
						querySnapshot.docs.map((doc) => ({
							id: doc.id,
							...doc.data(),
						})),
					);
				});

				setLoading(false);
			} catch (error) {
				console.log(error);
				setError(error.message);

				setLoading(false);
			}
		}

		loadData();
	}, [docCollection, search, uid, canceled]); // will execute useEffect whenever one of these states changes

	// avoid memory leak
	useEffect(() => {
		setCanceled(false);
		return () => setCanceled(true);
	}, []);

	return { documents, loading, error };
};
