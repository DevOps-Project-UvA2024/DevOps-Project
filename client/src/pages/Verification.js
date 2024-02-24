import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Form, InputNumber, Button, message } from 'antd';


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
    const [code, setCode] = useState();
    const navigate = useNavigate(); // Use this for redirecting after successful verification
  
    const onFinish = async () => {
      try {
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });
        if (!response.ok) throw new Error('Code verification failed');
        const data = await response.json();
        message.success(data.message || 'Code verified successfully');
        navigate('/nextPage'); // Replace '/nextPage' with the actual path you want to navigate to
      } catch (error) {
        console.error('Verification error:', error);
        message.error('Verification failed, please try again.');
      }
    };
  
    return (
      <CenteredFlexContainer>
        <StyledCodeVerificationContainer>
          <StyledFormTitle>Verfication Code</StyledFormTitle>
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Verification Code"
              name="code"
              rules={[{ required: true, message: 'Please input your code!' }]}
            >
              <InputNumber min={1} max={9999} onChange={setCode} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Verify Code
              </Button>
            </Form.Item>
          </Form>
        </StyledCodeVerificationContainer>
      </CenteredFlexContainer>
    );
  };
  
  export default CodeVerification;