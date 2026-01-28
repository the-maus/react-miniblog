import styles from "./EditPost.module.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";

const EditPost = () => {
	const { id } = useParams();
	const { document: post } = useFetchDocument("posts", id);

	const [title, setTitle] = useState("");
	const [image, setImage] = useState("");
	const [body, setBody] = useState("");
	const [tags, setTags] = useState([]);
	const [formError, setFormError] = useState("");
	const { user } = useAuthValue();
	const navigate = useNavigate();
	const { updateDocument, response } = useUpdateDocument("posts");

	useEffect(() => {
		if (post) {
			setTitle(post.title);
			setBody(post.body);
			setImage(post.image);
			setTags(post.tagsArray.join(", "));
		}
	}, [post]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setFormError("");

		// validate image URL
		try {
			new URL(image);
		} catch (error) {
			setFormError("Image must be a valid URL");
		}

		// create tags array
		const tagsArray = tags
			.split(",")
			.map((tag) => tag.trim().toLowerCase());

		// check all values
		if (!title || !image || !tags || !body) {
			setFormError("Please fill in all fields");
		}

		if (formError) return;

		const data = {
			title,
			image,
			body,
			tagsArray,
			uid: user.uid,
			createdBy: user.displayName,
		};

		updateDocument(id, data);

		// redirect to dashboard
		navigate("/dashboard");
	};

	return (
		<div className={styles.edit_post}>
			{post && (
				<>
					<h2>Editing Post: {post.title}</h2>
					<p>Update post data</p>
					<form onSubmit={handleSubmit}>
						<label>
							<span>Title:</span>
							<input
								type="text"
								name="title"
								required
								placeholder="Think about a nice title...."
								onChange={(e) => setTitle(e.target.value)}
								value={title}
							/>
						</label>
						<label>
							<span>Image URL:</span>
							<input
								type="text"
								name="image"
								required
								placeholder="Insert an image to represent your post"
								onChange={(e) => setImage(e.target.value)}
								value={image}
							/>
						</label>
						<p className={styles.preview_title}>Image preview: </p>
						<img
							src={post.image}
							alt={post.title}
							className={styles.image_preview}
						/>
						<label>
							<span>Content:</span>
							<textarea
								name="body"
								required
								placeholder="Insert the post content"
								onChange={(e) => setBody(e.target.value)}
								value={body}
							/>
						</label>
						<label>
							<span>Tags:</span>
							<input
								type="text"
								name="tags"
								required
								placeholder="Insert the tags (comma separated)"
								onChange={(e) => setTags(e.target.value)}
								value={tags}
							/>
						</label>
						{!response.loading && (
							<button className="btn">Save</button>
						)}
						{response.loading && (
							<button className="btn" disabled>
								Wait...
							</button>
						)}
						{response.error && (
							<p className="error">{response.error}</p>
						)}
						{formError && <p className="error">{formError}</p>}
					</form>
				</>
			)}
		</div>
	);
};

export default EditPost;
