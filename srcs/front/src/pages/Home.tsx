import React from "react";
import { useNavigate } from "react-router-dom";
// import '../styles/home.css'

const   Home = (props) => {
    const { loggedIn, email } = props;
    var navigate = useNavigate();

    const onButtonClick = () => {
        navigate("/login")
    }

    return (    
        <div className="mainContainer" >
            <div className={"titleContainer"}>
                <h1 className="is-size-1">Welcome!</h1>
            </div>
            <div className="text-info">
                <p>
                    This is the home page.
                </p>
            </div>
            <div className={"buttonContainer"}>
                <input
                    className={"inputButton"}
                    type="button"
                    onClick={onButtonClick}
                    value={loggedIn ? "Log out" : "Log in"}
                />
                {(loggedIn ? <div>
                    Your email address is {email}
                </div> : <div/>)}
            </div>
        </div>
    )
}

export default Home;
