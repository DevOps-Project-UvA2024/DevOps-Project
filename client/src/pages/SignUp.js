import React, { useState, useEffect  } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import styled from 'styled-components';
import { useNavigate, Navigate } from 'react-router-dom';
import PasswordChecklist from "react-password-checklist"
import { useAuth, AuthStatus } from '../AuthProvider';
import {allowedDomains} from '../utils';

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
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [email, setEmail] = useState('');
  const [isEmailDomainValid, setIsEmailDomainValid] = useState(true);

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
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not a valid email!' }]}
          validateStatus={isEmailDomainValid ? '' : 'error'}
          help={isEmailDomainValid ? '' : 'Email domain is not allowed.'}
        >
          <Input onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          hasFeedback>
          <Input.Password onChange={(e) => setPassword(e.target.value)} />
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
          <Input.Password onChange={(e) => setPassword2(e.target.value)} />
        </Form.Item>

        <PasswordChecklist
            rules={["minLength","specialChar","number","capital","match"]}
            minLength={8}
            value={password}
            valueAgain={password2}
            onChange={(isValid) => {}}
          />
        

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="link" onClick={() => navigate('/signin')}>
            Already have an account? Sign In
          </Button>
        </Form.Item>

      </Form>
    </StyledSignUpContainer>
    </CenteredFlexContainer>
  );
};

export default SignUp;
