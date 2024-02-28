import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert, Input, message } from 'antd';

const CenteredFlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
`;

const StyledCodeVerificationContainer = styled.div`
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

const CodeVerification = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const [form] = Form.useForm();

    useEffect(() => {
      
      form.setFieldsValue({
        email: location.state?.email
      });
  
    }, [form, location.state?.email]);
    
    const onFinish = async (values) => {
      try {
        const response = await fetch('api/users/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        if (!response.ok) throw new Error('Code verification failed');
        navigate('/signin', { state: { successMessage: 'Verification successful. Please sign in.' } });
      } catch (error) {
        console.error(error);
        setErrorMessage(error);
      }
    };

    const resetVerification = async () => {
      const email = form.getFieldValue('email');
      try {
        const response = await fetch('api/users/auth/resend-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email: email}),
        });
        if (!response.ok) throw new Error('Error while resending verification');
        message.success('Verification email resent!');      
      } catch (error) {
        console.error(error);
        message.error(error.message);
      }
    }
  
    return (
      <CenteredFlexContainer>
        <StyledCodeVerificationContainer>
          <StyledFormTitle>Verfication Code</StyledFormTitle>
          {errorMessage && (
            <Alert
              message={errorMessage}
              type="error"
              showIcon
              closable
              onClose={() => setErrorMessage('')}
            />
          )}
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: 'email', message: 'The input is not a valid email!' }, 
              { required: true, message: 'Please input your email!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Verification Code"
              name="code"
              rules={[{ required: true, message: 'Please input your code!' }]}
            >
              <Input />
            </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button type="primary" htmlType="submit">
                  Verify Code
                </Button>
                <Button type="link" onClick={resetVerification}>
                  Resend Verification
                </Button>
              </div>
          </Form>
        </StyledCodeVerificationContainer>
      </CenteredFlexContainer>
    );
  };
  
  export default CodeVerification;