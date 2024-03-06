import React, { useEffect, useContext, useState, useCallback }from 'react';
import { Table, Button, Rate, Checkbox , Modal, message, Tooltip, Form, Input, Upload} from 'antd';
import { DownloadOutlined, StarOutlined, InboxOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import "../styles/analytics.css"

const CourseAnalytics = () => {
    const { courseid } = useParams(); 
    const navigate = useNavigate();
    const [topUploaders, setTopUploaders] = useState([]);
    const [topFiles, setTopFiles] = useState([]);
    const [loadingTopUploaders, setLoadingTopUploaders] = useState(true);
    const [loadingTopFiles, setLoadingTopFiles] = useState(true);

    const columnsTopUploaders = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
          title: 'Files Uploaded',
          dataIndex: 'fileCount',
          key: 'filesUploaded',
        },
      ];

      const columnsTopFiles = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => text.split("/").pop()
        },
        {
          title: 'Rating',
          dataIndex: 'averageRating',
          key: 'rating',
          render: averageRating => <Rate disabled allowHalf defaultValue={Math.round(Number(averageRating) * 2) / 2} />,
        },
        {
          title: 'Number of Ratings',
          dataIndex: 'totalVotes',
          key: 'n_votes',
          align:'center'
        },
      ];
    
      const fetchTopUploaders = useCallback(() => {
        fetch(`/api/courses/${courseid}/course-analytics/top-uploaders`, {
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
            setLoadingTopUploaders(false);
        })
        .catch(error => console.error('Error fetching files:', error));
        }, [courseid]);

    const fetchTopFiles = useCallback(() => {
      fetch(`/api/courses/${courseid}/course-analytics/top-files`, {
          method: 'GET',
          credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
          setTopFiles(data);
          setLoadingTopFiles(false);
      })
      .catch(error => console.error('Error fetching files:', error));
      }, [courseid]);

      useEffect(() => {
        fetchTopUploaders();
        fetchTopFiles();
    }, [fetchTopUploaders, fetchTopFiles]);

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