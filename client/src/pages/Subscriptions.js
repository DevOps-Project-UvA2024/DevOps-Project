import React, { useEffect, useContext, useState, useRef, useCallback } from 'react';
import "../styles/tables_style.css"
import StoreContext from '../store/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Table, Checkbox, message } from 'antd';
import FilterBar from '../components/FilterBar';

const Subscriptions = () => {

  const navigate = useNavigate();
  const { state, dispatch } = useContext(StoreContext);

  let locale = {
    emptyText: 'There are no subscriptions available yet!',
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


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => <a href="/" onClick={(e) => { 
        e.preventDefault(); 
        navigate(`/courses/${record.Course.id}`); 
      }}>{record.Course.name}</a>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record ) => record.Course.department
    },
    {
      title: 'Subscribed',
      dataIndex: 'active',
      key: 'active',
      align: 'center',
      render: (_, record) => (
        <Checkbox 
          defaultChecked={record.active}
          onChange={(e) => toggleSubscribeCourse(e.target.checked, record.id)} 
        />
      )
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
