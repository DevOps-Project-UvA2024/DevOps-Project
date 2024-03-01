
import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined, SmileTwoTone } from '@ant-design/icons';
import { UserOutlined, LockOutlined, SmileTwoTone } from '@ant-design/icons';
import styled from 'styled-components';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, AuthStatus } from '../AuthProvider';
import "../styles/verification_style.css"
import loginImage from '../images/login.png'


const SignIn = () => {

  const navigate = useNavigate(); 
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  const { authStatus } = useAuth();

  if (authStatus === AuthStatus.SignedIn) {
    return <Navigate to="/greeting" replace />;
  }

  const handleFinish = async (values) => {

    fetch('/api/users/auth/signin', {
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
    })
    .then(data => {
      console.log('Sign-in successful:', data);
      window.location.reload(); 
    })
    .catch(async (errorResponse) => {
      const error = await errorResponse.json(); 
      setErrorMessage(error);
    });
  };

  // Form submission failed handler
  const handleFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const redirectToSignUp = () => {
    navigate('/signup'); // Adjust the path as needed
  };

  return (
    <div className='background'>x
    <div className='welcome-container'>
      <h1><b>Welcome back! </b></h1>
      <img src={loginImage}/>
    </div>
    <div className="auth-container">
      <h2>Hello! <SmileTwoTone/></h2>
      <h4>Sign In to your account!</h4>
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          closable
          onClose={() => setErrorMessage('')} 
        />
      )}
      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          showIcon
          closable
        />
      )}
      <Form
        name="signin"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}        
        autoComplete="off"
        layout="vertical"
        className='form'
      >
        

        <Form.Item
          label="Email"
          name="username"
          rules={[{ type: 'email', message: 'The input is not a valid email!' }, { required: true, message: 'Please input your email!' }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined/>}/>
        </Form.Item>
        <Button type="link" className='forgot-pass-btn' onClick={() => navigate("/reset-password")}>
              Forgot password?
        </Button>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sign In
          </Button>
        </Form.Item>

      </Form>

      <div className='verificationButtons'> 


        <Button type="link" onClick={() => navigate("/verify-account")}>
          You haven't been verified yet?
        </Button>

        <Button type="link" onClick={redirectToSignUp}>
          Don't have an account yet? Sign Up
        </Button>
      </div>
      

    </div>
    </div>
  );
};

export default SignIn;
