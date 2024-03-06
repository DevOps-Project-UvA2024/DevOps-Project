import React, { useEffect, useContext, useState, useRef, useCallback } from 'react';
import "../styles/tables_style.css"
import StoreContext from '../store/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Input, Table, message, Checkbox } from 'antd';
import FilterBar from '../components/FilterBar';

const Courses = () => {

  const navigate = useNavigate();
  const {TextArea} = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const { state, dispatch } = useContext(StoreContext);

  const showModal = () => {
    setIsModalOpen(true);
  };

  let locale = {
    emptyText: 'There are no courses available yet!',
  };

  const toggleSubscribeCourse = async (active, courseId) => {
    try {
      const response = await fetch('/api/subscriptions/toggle-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: courseId,
          active: active
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error('Error creating course');
      message.success(result.message);
    } catch (error) {
      message.error(error);
    }
  }

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
      dispatch({ type: 'RESET_COURSES'});
      fetchCourses();
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
    },
    {
      title: 'Subscribed',
      dataIndex: 'active',
      key: 'active',
      align: 'center',
      render: (_, record) => (
        <Checkbox 
          defaultChecked={record.Subscriptions.length ? record.Subscriptions[0]["active"] : false}
          onChange={(e) => toggleSubscribeCourse(e.target.checked, record.id)} 
        />
      )
    }
  ];

  const fetchCourses = useCallback(() => {
    fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
        dispatch({ type: 'RESET_COURSES'});
        dispatch({ type: 'SET_COURSES', payload: data });
    })
    .catch(error => console.error('Error fetching courses:', error));
  }, [dispatch]);
  
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const customFooter = [
    <Button key="back" onClick={handleCancel}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={() => formRef.current.submit()}>
      Submit
    </Button>,
  ];

  const filters = [
    <Form.Item key="name" name="name" label="Name">
      <Input placeholder="Name" />
    </Form.Item>,
    <Form.Item key="department" name="department" label="Department">
      <Input placeholder="Department" />
    </Form.Item>
  ];

  return (
    <div className="container-table">
      <div className='table-container'>
        <div className='add-course-btn'>
          <h2>Available Courses</h2>
          {state.user && state.user.role_id === 2 && (
            <>
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
            </>)
          }
        </div>
        <FilterBar
          submitUrl="/api/courses"
          filters={filters}
          type = 'COURSES'
        />
        <Table locale={locale} columns={columns} dataSource={state.courses} rowKey={"id"} 
            pagination={{ defaultPageSize: 10, showSizeChanger: true}}
          />
      </div>
    </div>
  )
}


export default Courses
