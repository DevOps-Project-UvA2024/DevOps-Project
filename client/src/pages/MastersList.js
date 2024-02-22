// src/pages/UserTable.js
import React from 'react';
import { Table } from 'antd';

const dataSource = [
  {
    key: '1',
    name: 'Software Engineering',
    
  },
  {
    key: '2',
    name: 'Artificial Intelligence',
   
  }
];

const columns = [
 
  {
    title: 'Master',
    dataIndex: 'name',
    key: 'name',
  }
];

const UserTable = () => {
  return <Table dataSource={dataSource} columns={columns} />;
};

export default UserTable;
