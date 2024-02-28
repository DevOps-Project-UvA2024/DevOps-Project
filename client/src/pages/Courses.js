import React, { useEffect, useContext } from 'react';
import { Table } from 'antd';
import "../styles/tables_style.css"
import StoreContext from '../store/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Input, Alert, Space, Table, Tag } from 'antd';



const Courses = () => {

  const navigate = useNavigate();
  const {TextArea} = Input;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
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
      render: (text, record) => <a onClick={(e) => { 
        e.preventDefault(); 
        //console.log(record);
        navigate(`/courses/${record.id}`); 
      }}>{text}</a>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
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

  console.log(state.courses)

  return (
    <div className="container-table">
      <div className='table-container'>
        <div className='add-course-btn'>
          <h2>Available Courses</h2>
          <Button type="primary" onClick={showModal}>
            Add course 
          </Button>
          <Modal title="Add a new course" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Form>
              <Form.Item
                label="Course Name"
                name="course"
                rules={[{ required: true, message: 'Please enter the course\'s name' }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Department"
                name="department"
                rules={[{ required: true, message: 'Please input the department of the course!' }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter a description!' }]}>
                <TextArea rows={4} placeholder="Enter a description for the course"/>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <Table columns={columns} dataSource={data}/>
      </div>
    </div>
  )
}


export default Courses
