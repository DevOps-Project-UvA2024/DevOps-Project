import React, { useState }  from 'react';
import { Space, Table, Tag } from 'antd';
import "../styles/tables_style.css"
import { PlusCircleTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'antd';



const Courses = () => {

  const navigate = useNavigate();

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

  const data = [
    {
      key: '1',
      name: 'Artificial Intelligence',
      id: 32,
      department: 'Faculty of Science'
    },
    {
      key: '2',
      name: 'Software Engineering',
      id: 42,
      department: 'Faculty of Science'
    },
    {
      key: '3',
      name: 'Archaelogy',      
      id:66,
      department: 'Faculty of Humanities'
    },
  ]

  return (
    <div className="container-table">
      <div className='table-container'>
        <div className='add-course-btn'>
          <h2>Available Courses</h2>
          <Button type="primary" onClick={showModal}>
            Add course 
          </Button>
          <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            
          </Modal>
        </div>
        <Table columns={columns} dataSource={data}/>
      </div>
    </div>
  );
}


export default Courses
