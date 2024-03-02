import React, { useEffect, useContext, useState, useRef, useCallback } from 'react';
import "../styles/tables_style.css"
import StoreContext from '../store/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Table } from 'antd';
import FilterBar from '../components/FilterBar';

const Subscriptions = () => {

  const navigate = useNavigate();
  const { state, dispatch } = useContext(StoreContext);

  let locale = {
    emptyText: 'There are no subscriptions available yet!',
  };


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => <a href="/" onClick={(e) => { 
        e.preventDefault(); 
        navigate(`/subscriptions/${record.id}`); 
      }}>{text}</a>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.name.localeCompare(b.name),
    }
  ];

  const fetchSubscriptions = useCallback(() => {
    fetch('/api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
        dispatch({ type: 'RESET_SUBSCRIPTIONS'});
        dispatch({ type: 'SET_SUBSCRIPTIONS', payload: data });
    })
    .catch(error => console.error('Error fetching subscriptions:', error));
  }, [dispatch]);
  
  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const filters = [
    <Form.Item name="name" label="Name">
      <Input placeholder="Name" />
    </Form.Item>,
    <Form.Item name="department" label="Department">
      <Input placeholder="Department" />
    </Form.Item>
  ];

  return (
    <div className="container-table">
      <div className='table-container'>
        <FilterBar
          submitUrl="/api/subscriptions"
          filters={filters}
          type = 'SUBSCRIPTIONS'
        />
        <Table locale={locale} columns={columns} dataSource={state.subscriptions} rowKey={"id"} 
            pagination={{ defaultPageSize: 10, showSizeChanger: true}}
          />
      </div>
    </div>
  )
}

export default Subscriptions;
