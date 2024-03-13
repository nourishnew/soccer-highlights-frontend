import React from "react";
import NavBar from "./NavBar";
import main_img from "./soccer_image.png";

export default function Home() {
	return (
		<div className="home">
			<NavBar />
			<div className="home_banner">
				<img src={main_img} alt="soccer players" class="dashboard_image" />
				<div className="home_text fadeInDown">
					<p
						style={{
							color: "#180046",
							fontSize: "50px",
							fontWeight: "bold",
							fontFamily: "Jost, sans-serif",
						}}>
						Extract highlights from a whole broadcast video in minutes.
					</p>
					<p className="nunito-font">
						Its time to say good bye to hours of editing to make a soccer match
						highlights video...
					</p>
					<p className="nunito-font">
						Just upload the broadcast video and get action packed highlight clips
						of goals, shots, referee scenes, VAR scenes using our powerful AI model.
					</p>
					<button className="button-64">
						<span className="text">Try for free</span>
					</button>
				</div>
			</div>
		</div>
	);
}
