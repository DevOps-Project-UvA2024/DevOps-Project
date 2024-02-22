
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


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


  const onFinish = async (values) => {
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('SignIn request failed');
      const data = await response.json();
      message.success(data.message || 'Signed In successfully');
      // Optionally reset form or redirect user
    } catch (error) {
      console.error('SignIn error:', error);
      message.error('SignIn failed, please try again.');
    }
  };

  const redirectToSignUp = () => {
    navigate('/signup'); // Adjust the path as needed
  };

  return (
    <CenteredFlexContainer>
    <StyledSignInContainer class="container">
      <StyledFormTitle>Sign In</StyledFormTitle>
      <Form
        name="signin"
        onFinish={onFinish}
        layout="vertical"
      >
        

        <Form.Item
          label="Email"
          name="email"
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
