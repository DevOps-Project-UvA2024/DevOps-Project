
import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth, AuthStatus } from '../AuthProvider';
import { Navigate } from 'react-router-dom';

const CenteredFlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  width: 100vw; 
  background-color: #f0f2f5; 
`;

const StyledSignUpContainer = styled.div`
  padding: 20px;
  margin: 0;
  width:50%;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-radius: 8px;
  background-color: white; 
`;

const StyledFormTitle = styled.h1`
  text-align: center;
  color: #333;
`;

const SignUp = () => {

  // page navigation 
  const navigate = useNavigate();
  
  const { authStatus } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');


  if (authStatus === AuthStatus.SignedIn) {
    // User is signed in, redirect them to /greeting
    return <Navigate to="/greeting" replace />;
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
      navigate('/signin', { state: { successMessage: 'Signup successful. Please sign in.' } });
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

  const redirectToSignIn = () => {
    navigate('/signin'); 
  };

  return (
    <CenteredFlexContainer>
    <StyledSignUpContainer className="container">
      <StyledFormTitle>Sign Up</StyledFormTitle>
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
      >
        <Form.Item
          label="Username"
          name="name"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: 'email', message: 'The input is not a valid email!' }, 
          { required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="link" onClick={redirectToSignIn}>
            Already have an account? Sign In
          </Button>
        </Form.Item>

      </Form>
    </StyledSignUpContainer>
    </CenteredFlexContainer>
  );
};

export default SignUp;
