import * as React from "react";
import { useState } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import Nav from "./Nav";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();
const materialPurple = "#ab47bc";
const materialPurpleDark = "#5E1675";
const materialPurpleLight = "#ce93d8";
const lightBeige = "#fffff0";

export default function Login() {
	const { login, currentUser } = useAuth();
	const [error, setError] = useState();

	let navigate = useNavigate();
	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		try {
			await login(data.get("email"), data.get("password"));
			console.log("navigate to main");
		} catch {
			setError("Failed to sign up");
		}
		console.log({
			email: data.get("email"),
			password: data.get("password"),
		});
	};

	return (
		<div>
			<Nav />
			<Box
				sx={{
					height: "100vh",
					backgroundColor: "#fef1f0",
				}}>
				<Container component="main" maxWidth="xs" style={{ padding: "4em" }}>
					<CssBaseline />
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}>
						<Grid item sx={{ display: "flex", alignItems: "center" }}>
							<div
								style={{
									display: "inline-block",
									marginLeft: "0px",
									fontSize: "30px",
									fontFamily: "monospace",
									color: "#180046",
								}}>
								Sign in.
							</div>
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
											Don't have an account?
										</div>
										<Typography
											component="div"
											style={{ display: "inline-block" }}>
											<Link
												href="/signup"
												variant="body2"
												style={{
													textDecoration: "none",
													color: "#180046",
													fontSize: 16,
												}}>
												Sign up
											</Link>
										</Typography>
									</Grid>
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
							<Grid item xs={12} style={{ marginTop: "-15px" }}>
								<FormControlLabel
									control={
										<Checkbox
											value="allowExtraEmails"
											color="secondary"
											style={{ fontSize: 10 }}
										/>
									}
									label={
										<Typography
											variant="body1"
											style={{
												fontSize: 12,
												marginTop: "2px",
												marginLeft: "-5px",
											}}>
											Remember me
										</Typography>
									}
								/>
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
										backgroundColor: "#180046",
										boxShadow: "none",
									},
									fontSize: 16,
								}}>
								Sign In
							</Button>
						</Box>
					</Box>
				</Container>
			</Box>
		</div>
	);
}
