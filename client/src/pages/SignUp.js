// src/pages/SignUp.js
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import styled from 'styled-components';


const StyledSignUpContainer = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-radius: 8px;
  background-color: white; 
`;

const StyledFormTitle = styled.h1`
  text-align: center;
  color: #333;
`;

const SignUp = () => {
  const onFinish = async (values) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Signup request failed');
      const data = await response.json();
      message.success(data.message || 'Registered successfully');
      // Optionally reset form or redirect user
    } catch (error) {
      console.error('Signup error:', error);
      message.error('Signup failed, please try again.');
    }
  };

  return (
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
            Register
          </Button>
        </Form.Item>
      </Form>
    </StyledSignUpContainer>
  );
};

export default SignUp;
