
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PasswordChecklist from "react-password-checklist"



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


  const onFinish = async (values) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });


      if (!response.ok) throw new Error('Signup failed');
      const data = await response.json();
      
      message.success(data.message || 'Registered successfully');
      navigate('/signin');
      
    } catch (error) {
      console.error('Signup error:', error);
      message.error('Signup failed, please try again.');
    }
  };

  const redirectToSignIn = () => {
    navigate('/signin'); 
  };

  return (
    <CenteredFlexContainer>
    <StyledSignUpContainer class="container">
      <StyledFormTitle>Sign Up</StyledFormTitle>
      <Form
        name="register"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Username"
          name="username"
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
