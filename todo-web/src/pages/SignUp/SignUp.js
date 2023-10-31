import React, { useEffect, useState } from "react";
import useAxios from '../../useAxios';
import {generateOtpService, signUpService} from './SignUp.service'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import CustomSpinner from "../../components/Spinner";
import Base from "../../components/Base";

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
 
    const [signUpResponse, signUpError, signUpLoading, fetchSignUp, setLoginError] = useAxios();
    const [otpSentResponse, otpSentError, otpSentLoading, fetchOtpSent, setOtpSentError] = useAxios();

    useEffect(() => {
        if (otpSentResponse?.msg == 'success') {
            setOtpSent(true);
        }
    }, [otpSentResponse])
    const isFormvalid = () => {
        return username.trim() && firstName.trim() && password.trim() && confirmPassword.trim() && password.trim() == confirmPassword.trim()
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
            return;
        }
        if (password.trim() !== confirmPassword.trim()){
            setLoginError({'message': 'Password doesnot match'})
            return;
        }
        const data = {
            email: username.trim(),
            password: password.trim(),
            firstName: firstName.trim(),
            otp: otp
        }
        fetchSignUp(signUpService(data))
    }

    const sendOtpHandler = () => {
        if(isFormvalid()){
            fetchOtpSent(generateOtpService({'email': username}))
        }
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setOtp(value);
    };

    return (
        <Base>
        <div className="container d-flex justify-content-center">
            {
                signUpLoading || otpSentLoading && <CustomSpinner />
            }
            { !signUpLoading &&
            <>
                <Form onSubmit={handleSubmit} style={{width: '50%'}} className="border border-light-subtle mt-4 p-4">
                    <h3 className="d-flex justify-content-center">Sign Up Form</h3>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email</Form.Label>
                        <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </Form.Group>
                    {otpSent && 
                    <>
                     <input
                     type="text"
                     className="form-control mt-2"
                     value={otp}
                     onChange={handleChange}
                     maxLength="6"
                    /> 
                 <small className="text-muted">Enter the 6-digit OTP sent to your email</small></>}
                    {<div className=" d-flex justify-content-left">
                        <Button onClick={sendOtpHandler} className="btn btn-primary btn-sm" style={{marginTop: '4px', marginBottom:'4xp'}}>Send OTP {otpSent ? 'Again': ''}</Button>
                    </div>}
                    {
                        signUpError && 
                        <Alert key="warning" variant="warning" onClose={() => setLoginError(null)} dismissible>{signUpError}</Alert>
                    } 
                    {
                        otpSentError && 
                        <Alert key="warning" variant="warning" onClose={() => setOtpSentError(null)} dismissible>{otpSentError}</Alert>
                    }
                    <div className=" d-flex justify-content-center">
                        <Button type="submit" variant="outline-primary">Sign Up</Button>
                    </div>
                    
                </Form>
            </>
            }
        </div>
        </Base>
        
    )
}

export default SignUp