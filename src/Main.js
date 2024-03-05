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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { Container } from "@mui/material";
import { useDropzone } from "react-dropzone";
import Nav from "./Nav";
// import soccerPixelGrid from './soccer_pixel.jpeg';

const thumbsContainer = {
	display: "flex",
	flexDirection: "row",
	flexWrap: "wrap",
	marginTop: 16,
};
const thumb = {
	display: "inline-flex",
	borderRadius: 2,
	border: "1px solid #000000",
	marginBottom: 8,
	marginRight: 8,
	width: 100,
	height: 100,
	padding: 4,
	boxSizing: "border-box",
};
const thumbInner = {
	display: "flex",
	minWidth: 0,
	overflow: "hidden",
};
const img = {
	display: "block",
	width: "auto",
	height: "100%",
};

// drag and drop container style
const baseStyle = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	padding: "20px",
	borderWidth: 2,
	borderRadius: 2,
	borderColor: "#000000",
	borderStyle: "dashed",
	backgroundColor: "#fafafa",
	color: "#bdbdbd",
	outline: "none",
	transition: "border .24s ease-in-out",
	margin: "50px",
};
const focusedStyle = {
	borderColor: "#ab47bc",
};
const acceptStyle = {
	borderColor: "#00e676",
};
const rejectStyle = {
	borderColor: "#ff1744",
};

function Main() {
	const [progress, setProgress] = useState(0);
	const [uploadAlmostDone, SetUploadAlmostDone] = useState(false);
	const [uploadDone, setUploadDone] = useState(false);
	const [videos, setVideos] = useState([]); // Add videoUrl state
	const {
		acceptedFiles,
		getRootProps,
		getInputProps,
		isFocused,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		accept: {
			"video/mp4": [".mp4", ".MP4"],
		},
	});

	const thumbs = acceptedFiles.map((file) => (
		<div style={thumb} key={file.name}>
			<div style={thumbInner}>
				<img
					src={file.preview}
					style={img}
					alt="display "
					// Revoke data uri after image is loaded
					onLoad={() => {
						URL.revokeObjectURL(file.preview);
					}}
				/>
			</div>
		</div>
	));

	const style = useMemo(
		() => ({
			...baseStyle,
			...(isFocused ? focusedStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isFocused, isDragAccept, isDragReject]
	);

	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () =>
			acceptedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
	}, []);

	const { currentUser, logOut } = useAuth();
	let navigate = useNavigate();

	useEffect(() => {
		if (!currentUser) {
			navigate("/home", { replace: true });
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
		acceptedFiles.forEach((file) => {
			formData.append("file", file);
			console.log(file.size);
		});
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
			console.debug("URLs: " + urls);

			//const extractedText = String(urls).match(/demo\/(.*?)(?=\?)/)[1];
			//const extractedTimeStamp = String(urls).match(/ARSENAL-(.*?)(?=_)/)[1];

			const matchResults = String(urls).match(/demo\/(.*?)(?=\?)/g) || [];
			const timestampMatches = String(urls).match(/ARSENAL-(.*?)(?=_)/g) || [];

			for (
				let i = 0;
				i < Math.max(matchResults.length, timestampMatches.length);
				i++
			) {
				const extractedText = matchResults[i]
					? matchResults[i].replace("demo/", "")
					: "";
				const extractedTimeStamp = timestampMatches[i]
					? timestampMatches[i].replace("ARSENAL-", "")
					: "";
				//console.log("Extracted Text: " + extractedText);
				//console.log("Timestamp: " + extractedTimeStamp);

				// add the values to respective arrays
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

	const appBackground = {
		// backgroundImage: `url(${soccerPixelGrid})`,
		backgroundSize: "auto",
		backgroundRepeat: "repeat",
		minHeight: "100vh", // Ensures it covers at least the full height of the viewport
		minWidth: "100vw", // Ensures it covers at least the full width of the viewport
	};

	const materialPurple = "#ab47bc";
	const materialPurpleDark = "#5E1675";
	const materialPurpleLight = "#ce93d8";
	const lightBeige = "#fffff0";

	return (
		<div>
			{/* <Button
				onClick={handleSignOut}
				variant="contained"
				color="secondary"
				style={{ margin: "2em" }}>
				Sign out
			</Button> */}
			<Nav />
			{!displayVideos ? (
				<Container
					disableGutters
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						width: "50%",
						padding: "1em",
					}}>
					<h3>Upload a soccer broadcast video to get started </h3>
					{/* <input type="file" onChange={handleFileChange} /> */}
					<section className="container">
						<div {...getRootProps({ className: "dropzone", style })}>
							<input {...getInputProps()} />
							<UploadFileIcon style={{ fontSize: "40px" }} />
							<p>Drag and drop video here, or click to select files</p>
						</div>
						<aside style={thumbsContainer}>{thumbs}</aside>
					</section>
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
						}}>
						<CheckCircleOutlineIcon style={{ marginRight: "5px" }} />
						Submit
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
					{uploadDone ? <p> Upload done</p> : null}
					{uploadDone ? (
						<div>
							<h3
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}>
								{" "}
								Video has been uploaded. Please wait few minutes for the video
								to be processes and then press "Get videos"..
							</h3>

							<Button
								onClick={fetchVideoUrl}
								variant="contained"
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: "#180046",
									boxShadow: "none",
									marginTop: "1em",
									"&:hover": {
										backgroundColor: "#180046",
										boxShadow: "none",
									},
									fontSize: 18,
								}}>
								Fetch Videos
							</Button>
						</div>
					) : null}
				</Container>
			) : null}

			{/* <h3 style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>Play highlights reel</h3> */}
			{/* <Button onClick={handlePlayVideo}
						variant="contained"
						style={{
					margin:'2em',
					backgroundColor:materialPurple,
					boxShadow:'none',
					'&:hover':{
						backgroundColor:materialPurpleDark,
						boxShadow:'none'
					},
					fontSize:16 }}>
				Play Video
			</Button> */}

			{/* { videos.map(video => <ReactPlayer url={video} playing={false} controls/>)} */}
			<Grid
				container
				spacing={2}
				style={{ marginRight: "20px", marginLeft: "20px" }}>
				{allExtractedTexts &&
					videos.map((video, index) => (
						<Grid item xs={4} key={index}>
							{/* <div style={{fontSize:11}}>Name: {allExtractedTexts[index]}</div> */}
							<div style={{ fontSize: 16, marginBottom: "4px" }}>
								Goal or referee scene detected at{" "}
								{allExtractedTimeStamps[index]}
							</div>
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
			{/* <ReactPlayer url={videoUrl} playing controls /> */}
			{/* <ReactPlayer url='https://www.youtube.com/watch?v=s2U17evRAmM' /> */}
		</div>
	);
}

export default Main;
