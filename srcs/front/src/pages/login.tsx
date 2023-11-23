import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"

const	Login = (props:any) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const navigate = useNavigate();

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
		<div className="hero is-fullheight">
			<div className="hero-body has-text-centered">
				<div className="columns">
					<form className="box" action="">
						<div className={"is-size-4-mobile is-flex is-justify-content-center is-align-content-center"}>
							<h1 className="is-size-1">Login</h1>
						</div>

						<div className="column">
							<div className={"column is-size-4-mobile"}>
								<input
									value={email}
									placeholder="Enter your email here"
									onChange={ev => setEmail(ev.target.value)}
									className={"inputBox"}
									/>
								<label className="errorLabel">{emailError}</label>
							</div>
							<div className={"column is-size-4-mobile"}>
								<input
									value={password}
									placeholder="Enter your password here"
									onChange={ev => setPassword(ev.target.value)}
									className={"inputBox"}
								/>
								<label className="errorLabel">{passwordError}</label>
							</div>
						</div>

						<div className={"is-size-4-mobile is-flex is-justify-content-center is-align-content-center"}>
							<input
								className={"inputButton"}
								type="button"
								onClick={onButtonClick}
								value={"Log in"}
								/>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Login;
