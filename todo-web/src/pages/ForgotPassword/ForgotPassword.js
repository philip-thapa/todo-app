import React, { useEffect, useState, useRef } from 'react'
import Base from "../../components/Base";
import useAxios from '../../useAxios';
import { Alert, Button, Form, Row } from 'react-bootstrap';
import CustomSpinner from '../../components/Spinner';
import { emailValidator } from '../../Validators';
import { forgotPasswordService } from './ForgotPassword.service';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const emailRef = useRef(null);
    const otpRef = useRef(null);
    const history = useHistory();
    const [forgetPwRes, forgetPwError, forgetPwLoading, fetchForgetPw, setForgetPwError] = useAxios();

    useEffect(() => {
        if (forgetPwRes?.success) {
            history.push('/signin')
        }else if (forgetPwRes?.msg === 'success'){
            setOtpSent(true);
        } else {
            emailRef.current.focus();
        }
    }, [forgetPwRes])

    useEffect(() => {
        if(otpSent) {
            otpRef.current.focus();
        }
    }, [otpSent])

    const handleOTPChange = (e) => {
        const value = e.target.value;
        setOtp(value);
    };

    const generateOtp = (e) => {
        e.preventDefault();
        setOtpSent(false);
        if (!emailValidator(email)){
            setForgetPwError('Invalid Email')
            return ;
        }
        fetchForgetPw(forgotPasswordService({'email': email}))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(otpSent){
            if (!otp || otp.length !== 6){
                setForgetPwError('Invalid OTP')
                return;
            }
            if(password.trim().length < 5){
                setForgetPwError('Password length must be at least 5 char')
                return;
            }
            if (password !== confirmPassword){
                setForgetPwError('Password & confirm password should match')
                return;
            }
        }
        let filters = {
            'email': email,
            'otp': otp,
            'password': password,
            'confirmPassword': confirmPassword
        }
        fetchForgetPw(forgotPasswordService(filters))
    }

    return (
        <Base>
            <div className="container d-flex justify-content-center">
                <Form onSubmit={handleSubmit} style={{width: '50%'}} className="border border-light-subtle mt-4 p-4">
                    <div className="text-center">
                        <h3>{otpSent ? 'Reset Password' : 'Forgot Password'}</h3>
                    </div>
                    
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email</Form.Label>
                        <Form.Control ref={emailRef} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    {!forgetPwLoading && !otpSent && <Button onClick={generateOtp} className="btn btn-primary" type="submit">Generate OTP {otpSent ? 'again' : ''}</Button>}
                    { otpSent && <>
                    <input
                        type="text"
                        className="form-control mt-2"
                        value={otp}
                        onChange={handleOTPChange}
                        maxLength="6"
                        ref={otpRef}
                    /> 
                    <small className="text-muted">Enter the 6-digit OTP sent to your email</small>
                    </>}
                    {otpSent && <><Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </Form.Group></>}
                    
                    <div className="d-grid gap-2">
                        {!forgetPwLoading && otpSent && <Button className="btn btn-primary" type="submit">RESET PASSWORD</Button>}
                        {forgetPwLoading && <CustomSpinner />}
                    </div>
                    {forgetPwError && 
                    <Row>
                        <Alert variant="warning" onClose={() => setForgetPwError(null)} dismissible>
                        {forgetPwError}
                        </Alert>
                    </Row>
                    }
                </Form>
            </div>
        </Base>
    )
}

export default ForgotPassword
