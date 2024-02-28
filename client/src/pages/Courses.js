import React, { useEffect, useContext, useState, useRef } from 'react';
import "../styles/tables_style.css"
import StoreContext from '../store/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Input, Table, message, Pagination } from 'antd';

const Courses = () => {

  const navigate = useNavigate();
  const {TextArea} = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const formRef = useRef(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('api/admin/courses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) throw new Error('Error creating course');
      form.resetFields();
      message.success(`Successfully added course category ${result.message[0].name}`);
    } catch (error) {
      message.error(error);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => <a href="/" onClick={(e) => { 
        e.preventDefault(); 
        navigate(`/courses/${record.id}`); 
      }}>{text}</a>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.name.localeCompare(b.name),
    }
  ];

  const { state, dispatch } = useContext(StoreContext);

  useEffect(() => {
    // Fetch user info from the backend
    fetch('/api/courses')
    .then(response => response.json())
    .then(data => {
        dispatch({ type: 'SET_COURSES', payload: data });
    })
    .catch(error => console.error('Error fetching courses:', error));
  }, [dispatch]);

  const customFooter = [
    <Button key="back" onClick={handleCancel}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={() => formRef.current.submit()}>
      Submit
    </Button>,
  ];

  return (
    <div className="container-table">
      <div className='table-container'>
        <div className='add-course-btn'>
          <h2>Available Courses</h2>
          <Button type="primary" onClick={showModal}>
            Add course 
          </Button>
          <Modal 
            title="Add a new course" 
            open={isModalOpen} 
            onCancel={handleCancel}
            footer={customFooter} >
            <Form
              form={form}
              ref={formRef}
              onFinish={handleSubmit}
            >
              <Form.Item
                label="Course Name"
                name="course"
                rules={[{ required: true, message: 'Please enter the course\'s name' }]}>
                <Input allowClear/>
              </Form.Item>
              <Form.Item
                label="Department"
                name="department"
                rules={[{ required: true, message: 'Please input the department of the course!' }]}>
                <Input allowClear/>
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter a description!' }]}>
                <TextArea rows={4} placeholder="Enter a description for the course" allowClear/>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <Table columns={columns} dataSource={state.courses} rowKey={"id"} 
            pagination={{ defaultPageSize: 10, showSizeChanger: true}}
          />
      </div>
    </div>
  )
}


export default Courses
