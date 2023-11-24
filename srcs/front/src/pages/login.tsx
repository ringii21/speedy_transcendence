import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"

const	Login = (props:any) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const navigate = useNavigate();

	const [user, setUser] = useState([])

	const fetchData = () => {
		fetch("http://10.32.1.6:3001/auth/42", {
			method: "GET"
		})
			.then((response) => response.json())
			.then((data) => {
				setUser(data);
				console.log(data);
			})
			.catch((error) => console.log(error));
	};

	useEffect(() => {
		fetchData();
	}, [])

	const onButtonClick = () => {
		// Set initial error values to empty
		setEmailError("")
		setPasswordError("")

		// Check if the user has entered both fields correctly
		if ("" === email) {
			setEmailError("Please enter your email")
			return
		}

		if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			setEmailError("Please enter a valid email")
			return
		}

		if ("" === password) {
			setPasswordError("Please enter a password")
			return
		}

		if (password.length < 7) {
			setPasswordError("The password must be 8 characters or longer")
			return
		}
	}

	return (
		<div className="container">
			<div className="hero-body has-text-centered">
				<form className="box columns is-mobile is-desktop is-multiline is-centered" action="">
					<div className="column">
						<h1 className="column is-size-1">Login</h1>
						<div className="column">
							<input
								value={email}
								placeholder="Enter your email here"
								onChange={ev => setEmail(ev.target.value)}
								className={"inputBox"}
								/>
						</div>
							<label className="errorLabel">{emailError}</label>
						<div className="column">
							<input
								value={password}
								placeholder="Enter your password here"
								onChange={ev => setPassword(ev.target.value)}
								className={"inputBox"}
							/>
							<label className="errorLabel">{passwordError}</label>
						</div>
						<div className="column">
							<input
								className={"inputButton"}
								type="button"
								onClick={onButtonClick}
								value={"Log in"}
								/>
							<input
								className={"inputButton"}
								type="button"
								onClick={fetchData}
								value={"Sign up"}
								/>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
