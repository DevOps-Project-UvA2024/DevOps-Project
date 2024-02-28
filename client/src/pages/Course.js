import React from 'react';
import { Space, Table, Tag } from 'antd';
import "../styles/tables_style.css"
import { PlusCircleTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';




const Course = () => {
    const navigate = useNavigate();
  
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <a onClick={() => navigate(`/courses/course`)}>{text}</a>,
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
        department: 'Faculty of Science',
        tags: ['science'],
      },
      {
        key: '2',
        name: 'Software Engineering',
        id: 42,
        department: 'Faculty of Science',
        tags: ['science'],
      },
      {
        key: '3',
        name: 'Archaelogy',
        
        department: 'Faculty of Humanities'
        
      },
    ]
  
    return (
      <div className="container-table">
  
        <div className='table-container'>
          <div className='add-course-btn'>
            <h2>Available Courses</h2>
            <PlusCircleTwoTone className='add-button'></PlusCircleTwoTone>
          </div>
          <Table columns={columns} dataSource={data}/>
  
        </div>
  
      </div>
    );
  }
  
  
  export default Course
  