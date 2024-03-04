import "./App.css";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AWS from 'aws-sdk';
import ReactPlayer from 'react-player'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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

	const fetchVideoUrl = async () => {
		try {
			setVideos([]);
			const response = await axios.get('http://localhost:8000/get-signed-url');
			const urls = response.data;
			console.debug("URLs: " + urls);
			setVideos(urls);
		} catch (error) {
			console.error('Error fetching signed URL:', error);
		}
	};

	// const handlePlayVideo = () => {
	// 	if (videoUrl) {
	// 		window.open(videoUrl, '_blank');
	// 	} else {
	// 		console.error('Video URL is not available.');
	// 	}
	// };

	const appBackground = {
		// backgroundImage: `url(${soccerPixelGrid})`,
		backgroundSize: 'auto',
		backgroundRepeat: 'repeat',
		minHeight: '100vh', // Ensures it covers at least the full height of the viewport
		minWidth: '100vw', // Ensures it covers at least the full width of the viewport
	};


	return (
		<div style={appBackground} className="App-header">
			{/* {currentUser && <h1>Hello {currentUser.email}</h1>} */}
			{/* <Button
				onClick={handleSignOut}
				variant="contained"
				color="secondary"
				style={{ margin: "2em" }}>
				Sign out
			</Button> */}
			<h1>⚽️ Reeltime: Soccer Highlights Extractor</h1>
			<h3> Step 1: Upload a file </h3>


			<input type="file" onChange={handleFileChange} />
			<Button
				onClick={handleUpload}
				variant="contained"
				style={{ margin: "2em" }}>
					<CheckCircleIcon />
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
			{uploadDone ? <p> {selectedFile.name} Upload done</p> : null}
			<h3> Step 2: Fetch video url</h3>
			<Button onClick={fetchVideoUrl} variant="contained" style={{ margin: '2em' }}>
				Fetch Video URL
			</Button>
			<h3> Step 3: Play highlights reel</h3>
			{/* <Button onClick={handlePlayVideo} variant="contained" style={{ margin: '2em' }}>
				Play Video
			</Button> */}
			{ videos.map(video => <ReactPlayer url={video} playing={false} controls/>)

			}
			{/* <ReactPlayer url={videoUrl} playing controls /> */}
			{/* <ReactPlayer url='https://www.youtube.com/watch?v=s2U17evRAmM' /> */}
		</div>
	);
}

export default Main;