import React, { useEffect, useContext, useState }from 'react';
import { Table, Button, Rate, Checkbox , Modal} from 'antd';
import { DownloadOutlined,StarOutlined } from '@ant-design/icons';
import StoreContext from '../store/StoreContext';

import "../styles/tables_style.css"


const Course = () => {
    
    //const navigate = useNavigate();

    const onChange = (checked, recordKey) => {
      console.log(`checked = ${checked}, key = ${recordKey}`);
    };

    const { state, dispatch } = useContext(StoreContext);


    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedName, setSelectedName] = useState('');
    const [modalRating, setModalRating] = useState(0); 

    const showNameModal = (name, yourate) => {
      setSelectedName(name);
      setModalRating(yourate);
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
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Uploaded By',
        key: 'uploadedby',
        sorter: (a, b) => a.uploadedby.localeCompare(b.uploadedby),
        render: (_, record ) => record.User.username
      },
      {
        title: 'Date',
        dataIndex: 'upload_date',
        key: 'upload_date',
        sorter: (a, b) => a.uploadedby.localeCompare(b.uploadedby),
        render: (text) => {
          const date = new Date(text);
          const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
          }).format(date);
          return formattedDate;
        }

      },
      {
        title: 'Rating',
        dataIndex: 'aggregate_voting',
        key: 'rating',
        render: aggregate_voting => <Rate disabled allowHalf defaultValue={Number(aggregate_voting)} />,
      },
      {
        title: 'Your Rating',
        dataIndex: 'yourate',
        key: 'yourate',
        align:'center',
        render: (_, record) => (
          <>
            <Button  onClick={() => showNameModal(record.name)}><StarOutlined />Rate</Button>
          </>
        ),

      },
      {
        title: 'Download',
        dataIndex: 'download',
        key: 'download',
        align: 'center',
        render: (_, record) => (          
            <Button type="primary" icon={<DownloadOutlined />} onClick={() => console.log("Button clicked!", record.key)}/>
        )
      },

      // change visibility only for admin
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status, record) => (
          <Checkbox 
            checked={status} 
            onChange={(e) => onChange(e.target.checked, record.key)} 
          />
        )
      }  
    ];

    
    const handleRateChange = (value) => {
      //setModalRating(value);
    };

    const urlPath = window.location.pathname; 
    const urlparams = urlPath.split('/'); 
    const course_id = urlparams.pop() || 'default'; 
    //console.log(course_id); 

    useEffect(() => {
      // Fetch user info from the backend
      fetch(`/api/files/${course_id}`)
      .then(response => response.json())
      .then(data => {
          console.log(data);  
          dispatch({ type: 'SET_FILES', payload: data });
      })
      .catch(error => console.error('Error fetching courses:', error));
    }, [dispatch, course_id]);
    
  
    
    return (
      <div className="container-table">  
        <div className='table-container'>
          <div className='add-course-btn'>
            <h2>Files</h2>                
          </div>
          <Table columns={columns} dataSource={state.files} rowKey={"id"}/>  
          <Modal  title="File Rating" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <div className='modal-rating'>
                <p>What is your rating for {selectedName}?</p>
                <Rate onChange={handleRateChange} value={modalRating} />
            </div>
         

          </Modal> 

        </div>  
      </div>
    );
  }
  
  
  export default Course
  