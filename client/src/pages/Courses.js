import React from 'react';
import { Space, Table, Tag } from 'antd';
import "../styles/tables_style.css"


const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
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
      id: 602,
      department: 'Faculty of Humanities',
      tags: ['humanities'],
    },
  ]

const Courses = () => 
<div className="container-table">
    <h2>Available Courses</h2>
    <Table columns={columns} dataSource={data}/>

</div>

export default Courses
