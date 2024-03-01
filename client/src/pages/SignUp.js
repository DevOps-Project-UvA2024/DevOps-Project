import React, { useState, useEffect  } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import styled from 'styled-components';
import { useNavigate, Navigate } from 'react-router-dom';
import PasswordChecklist from "react-password-checklist"
import { useAuth, AuthStatus } from '../AuthProvider';
import {allowedDomains} from '../utils';
import loginImage from '../images/signup.png'
import { UserOutlined, LockOutlined, SmileTwoTone, MailOutlined } from '@ant-design/icons';


const SignUp = () => {

  // page navigation 
  const navigate = useNavigate();
  
  const { authStatus } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [email, setEmail] = useState('');
  const [isEmailDomainValid, setIsEmailDomainValid] = useState(true);
  const [showPasswordChecklist, setShowPasswordChecklist] = useState(false);


  useEffect(() => {
    if (email) {
      checkEmailDomain(email);
    }
  }, [email]);


  if (authStatus === AuthStatus.SignedIn) {
    // User is signed in, redirect them to /greeting
    return <Navigate to="/courses" replace />;
  }

  const handleFinish = async (values) => {
    fetch('api/users/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
    .then(response => {
      if (!response.ok) {
        throw response; 
      }
      navigate('/verify-account', { state: { email: email} });
    })
    .then(data => {
      console.log('Sign-up successful:', data);
    })
    .catch(async (errorResponse) => {
      const error = await errorResponse.json(); 
      console.error('Sign-up error:', error);
      setErrorMessage(error);
    });
  };

  // Form submission failed handler
  const handleFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // Check if email domain corresponds to the allowed Domains
  const checkEmailDomain = (email) => {
    const domain = email.split('@')[1];
    if (domain && !allowedDomains.includes(domain)) {
      setIsEmailDomainValid(false);
    } else {
      setIsEmailDomainValid(true);
    }
  };


  return (
    <div className='background'>
      <div className='welcome-container'>
        <h1><b>Welcome to Student Portal! </b></h1>
        <h4>A place from students to students</h4>
        <img src={loginImage}/>
        <h4><i>Browse courses, upload files, rate others and more...</i></h4>
      </div>
    <div className="container">
      <h2>Welcome! </h2>
      <h4>Create an account here!</h4>

      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          closable
          onClose={() => setErrorMessage('')} // Allow users to close the alert
        />
      )}
      <Form
        name="register"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        autoComplete="off"
        layout="vertical"
        className='form register'

      >
        <Form.Item
          label="Username"
          name="name"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not a valid email!' }]}
          validateStatus={isEmailDomainValid ? '' : 'error'}
          help={isEmailDomainValid ? '' : 'Email domain is not allowed.'}
        >
          <Input prefix={<MailOutlined/>} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          hasFeedback>
          <Input.Password prefix={<LockOutlined/>} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item
            label="Re-enter password"
            name="password2"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
            hasFeedback
          >
          <Input.Password prefix={<LockOutlined/>} onChange={(e) => setPassword2(e.target.value)} />
        </Form.Item>

        <PasswordChecklist
            rules={["minLength","specialChar","number","capital","match"]}
            minLength={8}
            value={password}
            valueAgain={password2}
            onChange={(isValid) => {}}
            className='passcheck'
          />
        )}
        

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>

        
          
        

      </Form>
      
      <Button type="link" className='have-acc-btn' onClick={() => navigate('/signin')}>
            Already have an account? Sign In
          </Button>
    </div>
    </div>
  );
};

export default SignUp;
