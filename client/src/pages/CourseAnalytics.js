import React, { useEffect, useContext, useState, useCallback }from 'react';
import { Table, Button, Rate, Checkbox , Modal, message, Tooltip, Form, Input, Upload} from 'antd';
import { DownloadOutlined, StarOutlined, InboxOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import "../styles/analytics.css"

const CourseAnalytics = () => {
    const { courseid } = useParams(); 
    const navigate = useNavigate();
    const [topUploaders, setTopUploaders] = useState([]);
    const [loading, setLoading] = useState(false);


    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
          title: 'Files Uploaded',
          dataIndex: 'fileCount',
          key: 'filesUploaded',
          sorter: (a, b) => a.fileCount  - b.fileCount ,
          sortDirections: ['descend', 'ascend'],
        },
      ];
    
      const fetchTopUploaders = useCallback(() => {
        fetch(`/api/courses/${courseid}/course-analytics`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            const formattedData = data.map((item) => ({
               key: item.uploader_id,  // Assuming uploader_id is unique for each item.
                username: item.User.username,
                fileCount: item.fileCount,
            }));
            setTopUploaders(formattedData);
            setLoading(false);
        })
        
        .catch(error => console.error('Error fetching files:', error));

        
        }, [courseid]);

      useEffect(() => {
        fetchTopUploaders();
    }, [fetchTopUploaders]);

    console.log(topUploaders);

    return (
        <div className='course-analytics'>
        <h2>Course Analytics</h2>

        <div className="tables-containers">
            <h3>Top 5 Users</h3>
            <div className="top5users">
                <Table
                className='table'
                columns={columns}
                dataSource={topUploaders}
                rowKey="userId"
                loading={loading}
                pagination={false}
                /> 
            </div>

            <div className="top5files">
                <h3>Top 5 Uploads</h3>
                <Table
                className='table'
                columns={columns}
                dataSource={topUploaders}
                rowKey="userId"
                loading={loading}
                pagination={false}
                /> 
            </div>
             
             

        </div>

        
        </div> 
        );
}

export default CourseAnalytics