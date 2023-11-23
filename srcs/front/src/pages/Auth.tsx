import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const   Auth = () => {
    const   methods = useForm();
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    
    const   handleInputChange = (e:any) => {
        const { id, value } = e.target
        if (id === "email")
            setEmail(value)
        if (id === "password")
            setPassword(value)
        if (id === "confirmPassword")
            setConfirmPassword(value)
    };
    return (
        <div className="mainContainer">
            <FormProvider {...methods}>
                <div>
                    <h1 className="is-size-1">Inscrivez-vous</h1>
                </div>
                <div className="field">
                    <label className="label">Email</label>
                    <input className="inputForm" type="email" id="email" value={"email"} placeholder="Email" />
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <input className="inputForm" type="password" id="password" value={"password"} placeholder="Enter your password here" />
                </div>
                <div className="field">
                    <label className="label">Confirm password</label>
                    <input className="inputForm" type="password" id="password" value={"confirmPassword"} placeholder="Confirm password here" />
                </div>
            </FormProvider>
        </div>
    );
}

export default Auth;