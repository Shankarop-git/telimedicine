import React, { useEffect, useState } from 'react';
import { FaCheck, FaEnvelope, FaLock, FaTimes, FaUser } from 'react-icons/fa';
import SocialSignUp from './SocialSignUp';
import Spinner from 'react-bootstrap/Spinner'
import swal from 'sweetalert';
import { useDoctorSignUpMutation, usePatientSignUpMutation } from '../../redux/api/authApi';
import { message } from 'antd';

// password regex
// ^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@₹%^&*-]).{8,}₹
// At least one upper case English letter, (?=.*?[A-Z])
// At least one lower case English letter, (?=.*?[a-z])
// At least one digit, (?=.*?[0-9])
// At least one special character, (?=.*?[#?!@₹%^&*-])
// Minimum eight in length .{8,} (with the anchors)

const SignUp = ({ setSignUp }) => {
    const [error, setError] = useState({});
    const [infoError, setInfoError] = useState('');
    const [loading, setLoading] = useState(false);
    const formField = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    }
    const [user, setUser] = useState(formField)
    const [userType, setUserType] = useState('patient');
    const [doctorSignUp, { data: dData, isSuccess: dIsSuccess, isError: dIsError, error: dError, isLoading: dIsLoading }] = useDoctorSignUpMutation();
    const [patientSignUp, { data: pData, isSuccess: pIsSuccess, isError: pIsError, error: pError, isLoading: pIsLoading }] = usePatientSignUpMutation();
    const [passwordValidation, setPasswordValidation] = useState({
        carLength: false,
        specailChar: false,
        upperLowerCase: false,
        numeric: false
    })

    const handleSignUpSuccess = () => {
        setLoading(false);
        setUser(formField)
    }
    useEffect(() => {
        // doctor account
        if (dIsError && dError) {
            message.error(dError?.data?.message || "Something went wrong")
            setLoading(false);
        }

        if (!dIsError && dIsSuccess) {
            handleSignUpSuccess();
            setLoading(false);
            setLoading(false);
            swal({
                icon: 'success',
                text: `Successfully Account Created Please Verify Your email`,
                timer: 5000
            })
        }

        // Patient account
        if (pIsError && pError) {
            message.error(pError?.data?.message || "Something went wrong")
            setLoading(false);
        }
        if (!pIsError && pIsSuccess) {
            handleSignUpSuccess();
            setLoading(false);
            setSignUp(false);
            swal({
                icon: 'success',
                text: `Successfully ${userType === 'doctor' ? 'Doctor' : 'Patient'} Account Created Please Login`,
                timer: 2000
            })
        }

    }, [dIsError, dError, pError, pIsError, , pIsLoading, dIsLoading, pData, dData, setSignUp, setLoading, dIsSuccess])

    const [emailError, setEmailError] = useState({
        emailError: false
    })

    const handleEmailError = (name, value) => {
        if (name === 'email') {
            setEmailError({
                emailError: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            })
        }
    }
    const hanldeValidation = (name, value) => {
        if (name === 'password') {
            setPasswordValidation({
                carLength: (value.length >= 8),
                specailChar: /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value),
                upperLowerCase: /^(?=.*[a-z])(?=.*[A-Z])/.test(value),
                numeric: /^(?=.*\d)/.test(value),
            })
        }
    }

    const hanldeOnChange = (e) => {
        let { name, value } = e.target;
        hanldeValidation(name, value)
        handleEmailError(name, value)
        
        const newPass = { ...user };
        newPass[name] = value
        setUser(newPass)
    }

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    }
    const hanldeOnSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (userType === "doctor") {
            doctorSignUp(user);
        } else {
            patientSignUp(user)
        }
    }

    return (
        <form className="sign-up-form" onSubmit={hanldeOnSubmit}>
            <h2 className="title">Create Account</h2>
            <p className="text-muted small mb-4">Join the SevaCare India community</p>

            <div className="input-field">
                <span className="fIcon"><FaUser /></span>
                <input placeholder="First Name" name="firstName" type="text" onChange={(e) => hanldeOnChange(e)} value={user.firstName} required />
            </div>
            <div className="input-field">
                <span className="fIcon"><FaUser /></span>
                <input placeholder="Last Name" name="lastName" type="text" onChange={(e) => hanldeOnChange(e)} value={user.lastName} required />
            </div>
            <div className="input-field">
                <span className="fIcon"><FaEnvelope /></span>
                <input placeholder="Email" name="email" type="email" onChange={(e) => hanldeOnChange(e)} value={user.email} required />
            </div>
            <div className="input-field">
                <span className="fIcon"><FaLock /></span>
                <input type="password" name="password" placeholder="Password (min 8 chars)" onChange={(e) => hanldeOnChange(e)} value={user.password} required />
            </div>

            <div className='input-field d-flex align-items-center gap-2 justify-content-center'>
                <div className='text-nowrap'>Account Type:</div>
                <select
                    className="form-select w-50"
                    onChange={(e) => handleUserTypeChange(e)}
                    defaultValue='patient'
                >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                </select>
            </div>

            {infoError && <h6 className="text-danger text-center mt-2">{infoError}</h6>}
            
            <button type="submit"
                className="btn btn-primary btn-block mt-3 iBtn"
                disabled={
                    passwordValidation.carLength && emailError.emailError ? "" : true
                }
            >
                {loading ? <Spinner animation="border" variant="info" /> : "Sign Up"}
            </button>

            <p className="social-text">Or Sign up with social platforms</p>
            <SocialSignUp />
        </form>
    );
};

export default SignUp;