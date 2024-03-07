import React, { useContext } from 'react';
import { Form, Button, Row, Col } from 'antd';
import StoreContext from '../store/StoreContext';
import PropTypes from 'prop-types'; 
import { ReloadOutlined } from '@ant-design/icons';


const FilterBar = ({ submitUrl, filters, type }) => {
  const [form] = Form.useForm();
  const { dispatch } = useContext(StoreContext);

  const onFinish = async (values) => {
    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error('Network response was not ok.');
      dispatch({ type: 'RESET_' + type});
      dispatch({ type: 'SET_' + type, payload: data });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReset = async () => {
    form.resetFields();
    try {
        const response = await fetch(submitUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        if (!response.ok) throw new Error('Network response was not ok.');
        dispatch({ type: 'RESET_' + type});
        dispatch({ type: 'SET_' + type, payload: data });
      } catch (error) {
        console.error('Error:', error);
      }
  }

  return (
    <Form form={form} name="filterForm" onFinish={onFinish} layout="vertical">
        <Row gutter={24} wrap={false}>
        {filters.map((filter, index) => (
            <Col span={8} key={index}>
            {filter}
            </Col>
            
        ))} 
        <Col>
        <Form.Item>
            <Button type="primary" onClick={handleReset} icon={<ReloadOutlined />}>
                
            </Button>
        </Form.Item>
        </Col>
        <Col>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Apply
                    </Button>
                </Form.Item>
            </Col>
        </Row>
    </Form>
  );
};

FilterBar.propTypes = {
  filters: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  submitUrl: PropTypes.string.isRequired

};

export default FilterBar;
