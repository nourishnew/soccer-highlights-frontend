import React from "react";
import NavBar from "./NavBar";
import main_img from "./soccer_image.png";
export default function Home() {
	return (
		<div className="home">
			<NavBar />
			<div className="home_banner">
				<img src={main_img} alt="soccer players" class="dashboard_image" />
				<div className="home_text">
					<p
						style={{
							fontSize: "50px",
							fontWeight: "bold",
							fontFamily: "Jost, sans-serif",
						}}>
						Extract highlights from a whole broadcast video in minutes
					</p>
					<p>
						Its time to say good bye to hours of editing to make a soccer match
						highlights video
					</p>
					<p>Sign up for free</p>
				</div>
			</div>
		</div>
	);
}
