
import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import styled from 'styled-components';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, AuthStatus } from '../AuthProvider';


const CenteredFlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  width: 100vw; 
  background-color: #f0f2f5; 
`;

const StyledSignInContainer = styled.div`
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

const SignIn = () => {

  const navigate = useNavigate(); // Hook to navigate
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
      window.location.reload(); 
    })
    .then(data => {
      console.log('Sign-in successful:', data);
    })
    .catch(async (errorResponse) => {
      console.log(errorMessage)
      const error = await errorResponse.json(); 
      console.error('Sign-in error:', error);
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
    <CenteredFlexContainer>
    <StyledSignInContainer className="container">
      <StyledFormTitle>Sign In</StyledFormTitle>
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          closable
          onClose={() => setErrorMessage('')} // Allow users to close the alert
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
      >
        

        <Form.Item
          label="Email"
          name="username"
          rules={[{ type: 'email', message: 'The input is not a valid email!' }, { required: true, message: 'Please input your email!' }]}
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
            Sign In
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="link" onClick={() => navigate("/reset-password")}>
            Forgot password?
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="link" onClick={redirectToSignUp}>
            Don't have an account yet? Sign Up
          </Button>
        </Form.Item>
      </Form>
    </StyledSignInContainer>
    </CenteredFlexContainer>
  );
};

export default SignIn;
