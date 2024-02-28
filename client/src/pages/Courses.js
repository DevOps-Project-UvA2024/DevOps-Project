import React, { useEffect, useContext } from 'react';
import { Table } from 'antd';
import "../styles/tables_style.css"
import StoreContext from '../store/StoreContext';
import { useNavigate } from 'react-router-dom';




const Courses = () => {
  const navigate = useNavigate();

  const columns = [
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

const Courses = () => {
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
      <h2>Available Courses</h2>
      <Table columns={columns} dataSource={state.courses} rowKey={"id"}/>
    </div>
  )
}


export default Courses
