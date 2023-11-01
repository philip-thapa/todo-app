import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import useAxios from '../../useAxios';
import {signInService, userDetailsService} from './SignIn.service'
import {login} from '../../redux/authSlice';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CustomSpinner from "../../components/Spinner";
import Base from "../../components/Base";
import { storeToken } from "../../authHelper";
import { Alert, Row } from "react-bootstrap";
import { generateOtpService } from "../SignUp/SignUp.service";
import { emailValidator } from "../../Validators";
import '../globalpagecss.css'

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isOtp, setIsOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const emailRef = useRef(null);

    const [loginResponse, loginError, loginLoading, fetchLoginData, setLoginError] = useAxios();
    const [otpSentResponse, otpSentError, otpSentLoading, fetchOtpSent] = useAxios();
    const [userData, userError, userLoading, fetchUserData, setUserError] = useAxios();
    const errorState = [loginError, otpSentError, userError];

    const dispatch = useDispatch();

    useEffect(() => {
        emailRef.current.focus();
        if(userData?.data){
            dispatch(login(userData.data))
        }
    }, [userData])

    useEffect(() => {
        if (loginResponse?.success) {
            storeToken(loginResponse['access'])
                .then((res) => {
                    setTimeout(() => {
                        fetchUserData(userDetailsService())
                    }, 200)
                })
                .catch((error) => {
                    console.error('Error storing token:', error);
                });
        }
    }, [loginResponse])

    useEffect(() => {
        if(otpSentResponse?.msg === 'success')
        setOtpSent(true)
    }, [otpSentResponse])

    const handleSubmit = (e) => {
        e.preventDefault();
        if ((isOtp && (!otp || !email)) || (!isOtp && (!email.trim() || !password.trim()))){
            return 
        }
        if (!emailValidator(email)){
            setLoginError('Invalid Email')
            return
        }
        if (!isOtp && password.trim().length < 5){
            setLoginError('Minimum Password length is 5')
            return
        }
        const data = {
            email: email.trim(),
        }
        if (isOtp){
            data['otp'] = otp
        } else {
            data['password'] = password.trim()
        }
        fetchLoginData(signInService(data))
    }

    const sendOtpHandler = () => {
        if(!email){
            return
        }
        if(emailValidator(email)){
            fetchOtpSent(generateOtpService({'email': email, 'signin': true}))
        } else {
            setLoginError('Invalid Email')
        }
    }

    const loginTypeChange = () => {
        setIsOtp(!isOtp);
        setEmail('');
        setPassword('');
        setOtp('');
        setOtpSent(null);
        emailRef.current.focus();
    }

    const renderAlerts = errorState.map((error, index) => (
        error && (
          <Row key={index}>
            <Alert variant="warning" onClose={() => setLoginError(null)} dismissible>
              {error}
            </Alert>
          </Row>
        )
    ))

    const handleChange = (e) => {
        const value = e.target.value;
        setOtp(value);
    };
      
    return (
        <Base>
            <div className="container d-flex justify-content-center">
                
                <Form onSubmit={handleSubmit} style={{width: '50%'}} className="border border-light-subtle mt-4 p-4">
                    <div className="text-center">
                        <h3>Sign In</h3>
                        <h6 className="text-secondary">Login to access your Dashboard</h6>
                    </div>
                    
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email</Form.Label>
                        <Form.Control ref={emailRef} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    {!isOtp && <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>}
                    {isOtp && <div className="d-grid gap-2">
                        <button onClick={sendOtpHandler} className="btn btn-secondary" type="button">Generate OTP {otpSent ? 'Again': ''}</button>
                    </div>}
                    { (isOtp && otpSent) && 
                    <>
                    <input
                        type="text"
                        className="form-control mt-2"
                        value={otp}
                        onChange={handleChange}
                        maxLength="6"
                    /> 
                    <small className="text-muted">Enter the 6-digit OTP sent to your email</small>
                    </>}
                    <div className="text-center m-4 text-primary hover-pointer text-info" onClick={loginTypeChange}>{isOtp ? 'Login with password': 'Login using OTP '}</div>
                    { renderAlerts }
                    {(!isOtp || otpSent ) && <div className="d-grid gap-2">
                        <Button className="btn btn-primary" type="submit">Login</Button>
                    </div>}
                    {
                        (loginLoading || otpSentLoading || userLoading) && <CustomSpinner />
                    }
                </Form>
                
            </div>
        </Base>
    )
}

export default SignIn
