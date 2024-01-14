import "./App.css";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

function Main() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [progress, setProgress] = useState(0);
	const [uploadAlmostDone, SetUploadAlmostDone] = useState(false);
	const [uploadDone, setUploadDone] = useState(false);
	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};
	const { currentUser, logOut } = useAuth();
	let navigate = useNavigate();

	useEffect(() => {
		if (!currentUser) {
			navigate("/signup", { replace: true });
			console.log("redirecting to signup");
		} else {
			console.log("not redirecting to signup");
		}
	});

	const config = {
		onUploadProgress: (p) => {
			const percent = Math.round((p.loaded * 100) / p.total);
			setProgress(percent);
			console.log("percent: " + percent);
			if (percent === 100 && !uploadDone) {
				SetUploadAlmostDone(true);
				setProgress(80);
			}
		},
	};
	async function handleSignOut() {
		await logOut();
		navigate("/signup");
	}

	const handleUpload = () => {
		setUploadDone(false);
		SetUploadAlmostDone(false);
		const formData = new FormData();
		formData.append("file", selectedFile);
		axios
			.post("http://localhost:8000/upload", formData, config, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				setProgress(100);
				setUploadDone(true);
				SetUploadAlmostDone(false);
				setProgress(0);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div className="App-header">
			{currentUser && <h1>Hello {currentUser.email}</h1>}
			<Button
				onClick={handleSignOut}
				variant="contained"
				color="secondary"
				style={{ margin: "2em" }}>
				Sign out
			</Button>
			<h1>Soccer Highlights Extractor</h1>
			<input type="file" onChange={handleFileChange} />
			<Button
				onClick={handleUpload}
				variant="contained"
				color="secondary"
				style={{ margin: "2em" }}>
				Upload
			</Button>
			{progress > 0 ? (
				<LinearProgress
					variant="determinate"
					value={progress}
					style={{ width: "50%", backgroundColor: "white" }}
				/>
			) : null}
			{uploadAlmostDone ? (
				<p>"Almost done...Please wait few more minutes"</p>
			) : null}
			{uploadDone ? <p> {selectedFile.name} Upload done</p> : null}
		</div>
	);
}

export default Main;
