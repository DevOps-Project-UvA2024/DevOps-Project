import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
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

const StyledContainer = styled.div`
  padding: 20px;
  margin: 0;
  width: 50%;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-radius: 8px;
  background-color: white;
`;

const StyledFormTitle = styled.h1`
  text-align: center;
  color: #333;
`;

const PasswordReset = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [email, setEmail] = useState('');

  // Requests reset password email for user from server
  const sendResetEmail = () => {
    // API call to request a password reset email
    fetch('/api/users/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      setShowVerification(true); // Show verification and new password fields
    })
    .catch(async (errorResponse) => {
      const error = await errorResponse.json();
      setErrorMessage(error.error || 'Failed to send reset email.');
    });
  };

  // Confirms update of password from the server
  const handleFinish = async (values) => {
    // API call to change the password
    fetch('/api/users/auth/confirm-reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      navigate('/signin', { state: { successMessage: 'Password changed successfully. Please sign in with your new password.' } }); // If the password was changed successfully, navigate the user back to sign in page
    })
    .catch(async (errorResponse) => {
      const error = await errorResponse.json();
      setErrorMessage(error.error || 'Failed to reset password.');
    });
  };

  return (
    <CenteredFlexContainer>
      <StyledContainer>
        <StyledFormTitle>Reset Password</StyledFormTitle>
        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => setErrorMessage('')}
          />
        )}
        <Form
          name="passwordReset"
          onFinish={handleFinish}
          autoComplete="off"
          layout="vertical"
        >
        <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'The input is not a valid email!' }, { required: true, message: 'Please input your email!' }]}
        >
            <Input onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
          {/* After user has submitted the email to initiate password change, allow the user to apply the code and new password */}
          {showVerification && (
            <>
              <Form.Item
                label="Verification Code"
                name="verificationCode"
                rules={[{ required: true, message: 'Please input the verification code you received!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[{ required: true, message: 'Please input your new password!' }]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          {!showVerification && (
            <Form.Item>
              <Button type="primary" onClick={sendResetEmail}>
                Send Reset Email
              </Button>
            </Form.Item>
          )}
          {showVerification && (
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Confirm Password Change
              </Button>
            </Form.Item>
          )}
        </Form>
      </StyledContainer>
    </CenteredFlexContainer>
  );
};

export default PasswordReset;
