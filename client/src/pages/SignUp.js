
import React from 'react';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PasswordChecklist from "react-password-checklist"

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

  if (authStatus === AuthStatus.SignedIn) {
    // User is signed in, redirect them to /greeting
    return <Navigate to="/greeting" replace />;
  }

  const handleFinish = async (values) => {
    try {
      // Using Fetch API
      const response = await fetch('/api/users/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

    const data = await response.json();
    console.log(data);

    } catch (error) {
      console.error('Registration error:', error);
    }
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

        <Form.Item
          label="Re-enter password"
          name="password2"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Password must be at least 8 characters.' },
            { pattern: /(?=.*[0-9])/, message: 'Password must contain a number.' },
            { pattern: /(?=.*[!@#$%^&*])/, message: 'Password must contain a special character.' },
            { pattern: /(?=.*[A-Z])/, message: 'Password must contain an uppercase letter.' }
          
          ]}
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
