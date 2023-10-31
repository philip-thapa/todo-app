import React, { useEffect, useState } from "react";
import useAxios from '../../useAxios';
import {generateOtpService, signUpService} from './SignUp.service'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import CustomSpinner from "../../components/Spinner";
import Base from "../../components/Base";
import { emailValidator } from "../../Validators";
import { verifyEmailOtpService } from "../SignIn/SignIn.service";
import { Row, Toast } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [responseEmail, setResponseEmail] = useState('')
    const history = useHistory();
 
    const [signUpResponse, signUpError, signUpLoading, fetchSignUp, setSignUpError] = useAxios();
    const [otpSentResponse, otpSentError, otpSentLoading, fetchOtpSent, setOtpSentError] = useAxios();
    const [otpVerifyResponse, otpVerifyError, otpVerifyLoading, fetchOtpVerify, setOtpVerifyError] = useAxios();

    const errorState = [signUpError, otpSentError, otpVerifyError];

    useEffect(() => {
        if (otpSentResponse?.msg === 'success') {
            setOtpSent(true);
        }
    }, [otpSentResponse])

    useEffect(() => {
        if(otpVerifyResponse?.msg === 'success'){
            setIsOtpVerified(true)
            setResponseEmail(otpVerifyResponse?.email)
        }
    }, [otpVerifyResponse])

    useEffect(() => {
        if (signUpResponse?.msg === 'success'){
            history.push('/signin')
        }
    }, [signUpResponse])

    const isFormvalid = () => {
        if (!firstName.trim()){
            setSignUpError('First Name is mandatory');
            return false;
        }
        if (email !== responseEmail){
            setSignUpError('Email is not verified')
            return false;
        }
        if (password.trim() !== confirmPassword.trim()){
            setSignUpError('Password doesnot match')
            return false;
        }
        return true
    }

    const renderAlerts = errorState.map((error, index) => (
        error && (
          <Row key={index}>
            <Alert variant="warning" onClose={() => setSignUpError(null)} dismissible>
              {error}
            </Alert>
          </Row>
        )
    ))

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormvalid()) {
            return;
        }
        const data = {
            email: email.trim(),
            password: password.trim(),
            firstName: firstName.trim(),
        }
        fetchSignUp(signUpService(data))
    }

    const sendOtpHandler = () => {
        if(emailValidator(email)){
            fetchOtpSent(generateOtpService({'email': email, 'signup': true}))
        }
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setOtp(value);
    };

    const verifyEmailOtpHandler = () => {
        fetchOtpVerify(verifyEmailOtpService({'email': email, 'otp': otp}))
    }

    return (
        <Base>
        <div className="container d-flex justify-content-center">
            
            { !signUpLoading &&
            <>
                <Form onSubmit={handleSubmit} style={{width: '50%'}} className="border border-light-subtle mt-4 p-4">
                    <h3 className="d-flex justify-content-center">Sign Up Form</h3>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email {isOtpVerified && emailValidator(email) && <span className="badge bg-secondary">Verified</span>}</Form.Label>
                        <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    {
                        otpSent && !isOtpVerified &&
                        <>
                            <input
                            type="text"
                            className="form-control mt-2"
                            value={otp}
                            onChange={handleChange}
                            maxLength="6"
                            /> 
                            <small className="text-muted">Enter the 6-digit OTP sent to your email</small>
                        </>
                    }
                    {
                        (otpSentLoading || otpVerifyLoading) && <CustomSpinner />
                    }
                    {emailValidator(email) && !isOtpVerified && <div className=" d-flex justify-content-left">
                        <Button onClick={sendOtpHandler} className="btn btn-primary btn-sm" style={{marginTop: '4px', marginBottom:'4xp'}}>Send OTP {otpSent ? 'Again': ''}</Button>
                        { otpSent && otp.length == 6 && !isOtpVerified && <Button onClick={verifyEmailOtpHandler} className="btn btn-success btn-sm ml-3" style={{marginTop: '4px', marginBottom:'4xp'}}>Verify</Button>}
                    </div>}
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
                    
                    { renderAlerts }

                    {
                        signUpResponse?.msg === 'success' && 
                        <Row>
                            <Toast title="sign up success"  />
                        </Row>
                    }

                    {
                        signUpLoading && <CustomSpinner />
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