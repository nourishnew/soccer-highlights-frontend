import "./App.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AWS from "aws-sdk";
import ReactPlayer from "react-player";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import UploadIcon from "@mui/icons-material/Upload";

import { Container } from "@mui/material";
import Nav from "./Nav";
// import soccerPixelGrid from './soccer_pixel.jpeg';

function Main() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [progress, setProgress] = useState(0);
	const [uploadAlmostDone, SetUploadAlmostDone] = useState(false);
	const [uploadDone, setUploadDone] = useState(false);
	const [videos, setVideos] = useState([]); // Add videoUrl state

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const { currentUser, logOut } = useAuth();
	let navigate = useNavigate();

	useEffect(() => {
		if (!currentUser) {
			navigate("/home", { replace: true });
		}
	});

	const config = {
		onUploadProgress: (p) => {
			const percent = Math.round((p.loaded * 100) / p.total);
			setProgress(percent);
			if (percent === 100 && !uploadDone) {
				SetUploadAlmostDone(true);
				setProgress(80);
			}
		},
	};

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

	const [allExtractedTexts, setAllExtractedTexts] = useState([]);
	const [allExtractedTimeStamps, setAllextractedTimeStamps] = useState([]);
	const [displayVideos, setDisplayVideos] = useState(false);
	const fetchVideoUrl = async () => {
		try {
			setVideos([]);
			const response = await axios.get("http://localhost:8000/get-signed-url");
			const urls = response.data;

			const matchResults = String(urls).match(/demo\/(.*?)(?=\?)/g) || [];
			//
			const timestampMatches = String(urls).match(/demo\/(.*?)(?=_)/g) || [];

			for (
				let i = 0;
				i < Math.max(matchResults.length, timestampMatches.length);
				i++
			) {
				const extractedText = matchResults[i]
					? matchResults[i].replace("demo/", "")
					: "";
				const extractedTimeStamp = timestampMatches[i]
					? timestampMatches[i].replace(/demo\/.*?-/g, "")
					: "";

				setAllExtractedTexts((prevText) => [...prevText, extractedText]);
				setAllextractedTimeStamps((prevText) => [
					...prevText,
					extractedTimeStamp,
				]);
			}
			setVideos(urls);
			setDisplayVideos(true);
		} catch (error) {
			console.error("Error fetching signed URL:", error);
		}
	};

	return (
		<div>
			<Nav />
			{allExtractedTexts.length > 0 ? (
				<h3 style={{ textAlign: "center" }} className="nunito-font">
					Here are the highlight clips generated.
				</h3>
			) : (
				<h3 style={{ textAlign: "center" }} className="nunito-font">
					Upload a video to get started
				</h3>
			)}
			{!displayVideos ? (
				<Container
					disableGutters
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						width: "50%",
						padding: "2em",
						marginBottom: "2em",
					}}>
					{!uploadDone && (
						<div>
							<h3 style={{ textAlign: "center" }} className="nunito-font">
								It is recommended to use latest high quality videos from Fubo tv
								or Premier league team's official youtube channel to get good
								results since the ML model is trained on those videos.
							</h3>
							<h3 style={{ textAlign: "center" }} className="nunito-font">
								Recommended video length is 5-10 minutes. Processing time is
								around 3-4 minutes for a 10 minute video.
							</h3>
						</div>
					)}
					{!uploadDone && (
						<div className="fileUpload">
							<input
								id="file-upload"
								type="file"
								onChange={handleFileChange}
								className="upload"
							/>
							<span>Choose video from local</span>
						</div>
					)}
					{selectedFile && <p>{selectedFile.name}</p>}
					{!uploadDone && (
						<Button
							onClick={handleUpload}
							variant="contained"
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								backgroundColor: "#180046",
								boxShadow: "none",
								"&:hover": {
									backgroundColor: "#180046",
									boxShadow: "none",
								},
								fontSize: 18,
								marginBottom: "1em",
							}}>
							<CheckCircleOutlineIcon style={{ marginRight: "5px" }} />
							Upload
						</Button>
					)}
					{progress > 0 ? (
						<LinearProgress
							variant="determinate"
							value={progress}
							style={{ width: "75%", backgroundColor: "white" }}
						/>
					) : null}
					{uploadAlmostDone ? (
						<p className="nunito-font" style={{ textAlign: "center" }}>
							Your video is being uploaded. Please wait few more minutes...
						</p>
					) : null}
					{uploadDone ? (
						<p className="nunito-font" style={{ textAlign: "center" }}>
							Your video {selectedFile.name} has been uploaded
						</p>
					) : null}

					{uploadDone ? (
						<div>
							<h3
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									textAlign: "center",
								}}
								className="nunito-font">
								Please wait few more minutes for the video to be processed and
								then press the button below..
							</h3>
							<button
								className="button-64"
								onClick={fetchVideoUrl}
								style={{ margin: "auto" }}>
								<span className="text">Generate highlight clips</span>
							</button>
						</div>
					) : null}
				</Container>
			) : null}
			<Grid
				container
				spacing={2}
				style={{ marginRight: "20px", marginLeft: "20px" }}>
				{allExtractedTexts.length > 0 &&
					videos.map((video, index) => (
						<Grid item xs={4} key={index}>
							{allExtractedTexts[index].includes("penalty") ? (
								<p
									style={{
										fontSize: 15,
										marginBottom: "4px",
										fontWeight: "bold",
									}}>
									A Penalty or shot scene detected at{" "}
									{allExtractedTimeStamps[index]}
								</p>
							) : (
								<p
									style={{
										fontSize: 15,
										marginBottom: "4px",
										fontWeight: "bold",
									}}>
									A Goal or referee scene detected at{" "}
									{allExtractedTimeStamps[index]}
								</p>
							)}
							<ReactPlayer
								url={video}
								playing={false}
								controls
								width="90%"
								height="90%"
							/>
						</Grid>
					))}
			</Grid>
		</div>
	);
}

export default Main;
