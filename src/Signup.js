import * as React from "react";
import { useState } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
// TODO remove, this demo shouldn't need to reset the theme.

const materialPurple = "#ab47bc";

const inputStyles = {
	"&:hover fieldset": {
		borderColor: materialPurple, // Change hover highlight color
	},
	"&.Mui-focused fieldset": {
		borderColor: materialPurple, // Change focused highlight color
	},
};
const labelStyles = {
	"&.Mui-focused": {
		color: materialPurple, // Change label color when focused
	},
};

export default function SignUp() {
	const { signup, currentUser } = useAuth();
	const [error, setError] = useState();

	let navigate = useNavigate();
	const handleSubmit = async (event) => {
		setError();
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		try {
			await signup(data.get("email"), data.get("password"));
			navigate("/");
		} catch {
			setError(
				"Failed to sign up. Type a valid email address. The password should be more than 6 characters"
			);
		}
	};

	return (
		<div>
			<Nav />
			<Box
				sx={{
					height: "100vh",
					backgroundColor: "#fef1f0",
				}}>
				<Container component="main" maxWidth="sm" style={{ padding: "4em" }}>
					<CssBaseline />
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}>
						<Grid
							item
							sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
							<div className="nunito-font">Get Started for free</div>
						</Grid>
						<Box
							component="form"
							noValidate
							onSubmit={handleSubmit}
							sx={{ mt: 3 }}>
							<Grid container spacing={2} style={{ marginBottom: "20px" }}>
								<Grid container justifyContent="center">
									<Grid item>
										<div
											style={{
												display: "inline-block",
												marginRight: "3px",
												marginBottom: "10px",
											}}>
											Already have an account?
										</div>
										<Typography
											component="div"
											style={{ display: "inline-block" }}>
											<Link
												href="/login"
												variant="body2"
												style={{
													textDecoration: "none",
													color: "#180046",
													fontSize: 16,
													fontWeight: "bold",
												}}>
												Sign in
											</Link>
										</Typography>
									</Grid>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										autoComplete="given-name"
										name="firstName"
										InputProps={{ style: inputStyles }}
										InputLabelProps={{ style: labelStyles }}
										required
										fullWidth
										id="firstName"
										label="First Name"
										autoFocus
										variant="outlined"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										required
										fullWidth
										id="lastName"
										label="Last Name"
										name="lastName"
										autoComplete="family-name"
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										id="email"
										label="Email Address"
										name="email"
										autoComplete="email"
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										name="password"
										label="Password"
										type="password"
										id="password"
										autoComplete="new-password"
									/>
								</Grid>
							</Grid>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{
									mt: 5,
									mb: 2,
									backgroundColor: "#180046",
									boxShadow: "none",
									"&:hover": {
										backgroundColor: "#181046",
										boxShadow: "none",
									},
									fontSize: 16,
								}}>
								Sign Up
							</Button>
							{error && <p style={{ color: "red" }}>{error}</p>}
						</Box>
					</Box>
				</Container>
			</Box>
		</div>
	);
}
