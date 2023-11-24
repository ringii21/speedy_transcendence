import React, { useEffect, useState } from "react";
import "../styles/login.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const	Login = (props:any) => {
	const navigate = useNavigate()
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const [data, setData] = useState([])
	const axiosInstance = axios.create()
	axiosInstance.defaults.maxRedirects = 0
	axiosInstance.interceptors.response.use(
		response => response,
		error => {
			if (error.response && [301, 302].includes(error.response.status)) {
				const redirectUrl = error.response.headers.location;
				return axiosInstance.get(redirectUrl)
			}
			return Promise.reject(error)
			}
		)

	const onButtonClick = () => {
		axiosInstance.get("http://10.32.1.6:3000/auth/42")
		.then(response => {
			window.location.href = response.request.responseURL
			console.log(response)
		})
		.catch (error => {
			if (error.response) {
				console.error("Response error: ", error.response.data)
				console.error("Status code:", error.response.Status)
			} else if (error.request) {
				console.error("No response received")
			} else {
				console.error("Request setup error:", error.message)
			}
			console.error("Error config:", error.config)
		}
		)
	}

	return (
		<div className="mainContainer">
			<div className="hero-body has-text-centered">
				<div className="box columns">
					<div className="column">
						<h1 className="column is-size-1">Login</h1>
						<div className="column">
							<button
								className={"inputButton"}
								type="button"
								onClick={onButtonClick}
								value={"42 Log in"}
								>
								42 Log in
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
