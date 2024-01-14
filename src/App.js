import "./App.css";
import SignUp from "./Signup";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Main";
import Login from "./Login";
import { ProtectedRoute } from "./ProtectedRoute";
import NavBar from "./NavBar";
import Home from "./Home";

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/signup" element={<SignUp />} />
					<Route path="/login" element={<Login />} />
					<Route element={<ProtectedRoute />}>
						<Route path="/" element={<Main />} />
					</Route>
					<Route path="/home" element={<Home />} />
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;
