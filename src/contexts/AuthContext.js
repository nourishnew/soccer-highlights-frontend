import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(true);
	let navigate = useNavigate();
	async function signup(email, password) {
		await createUserWithEmailAndPassword(auth, email, password);
		navigate("/");
	}
	function logOut() {
		signOut(auth);
		navigate("/login");
	}

	async function login(email, password) {
		await signInWithEmailAndPassword(auth, email, password);
		navigate("/");
	}

	useEffect(() => {
		const unsubcribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setLoading(false);
		});
		return unsubcribe;
	}, []);

	const value = {
		currentUser,
		signup,
		login,
		logOut,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
