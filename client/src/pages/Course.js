import React, { useEffect, useContext, useState, useCallback }from 'react';
import { Table, Button, Rate, Checkbox , Modal, message} from 'antd';
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
    const [ratingOkText, setRatingOkText] = useState("Rate") ;
    const [modalFileId, setModalFileId] = useState(null);

    const showNameModal = async (file_name, file_id) => {

      const response = await fetch(`/api/files/rating/${file_id}`);
      const data = await response.json();
      setModalFileId(file_id);
      setSelectedName(file_name);
      setModalRating(data !== null 
        ? Math.round(Number(data.voting) * 2) / 2
        : 0);
      setRatingOkText(data !== null ? "Modify Rate" : "Rate");
      setIsModalOpen(true);
    };

    const handleOk = async () => {
      try {
        const response = await fetch(`/api/files/rating/${modalFileId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify({ rating: modalRating }),
        });
    
        if (!response.ok) {
          throw new Error("There was an error while rating");
        }
        const result = await response.json(); 
        message.success(`Successfully rated file ${selectedName}`);

        dispatch({ type: 'RESET_FILES' });
        fetchFiles(course_id);

        setIsModalOpen(false);
        return result; 
      } catch (error) {
        console.error(error);
      }
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
        render: aggregate_voting => <Rate disabled allowHalf defaultValue={Math.round(Number(aggregate_voting) * 2) / 2} />,
      },
      {
        title: 'Your Rating',
        dataIndex: 'yourate',
        key: 'yourate',
        align:'center',
        render: (_, record) => (
          <>
            <Button  onClick={() => showNameModal(record.name, record.id)}><StarOutlined />Rate</Button>
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
        hidden: state.user.role_id !== 2,
        render: (status, record) => (
          <Checkbox 
            checked={status} 
            onChange={(e) => onChange(e.target.checked, record.key)} 
          />
        )
      }  
    ];
    
    const urlPath = window.location.pathname; 
    const urlparams = urlPath.split('/'); 
    const course_id = urlparams.pop() || 'default'; 

    const fetchFiles = useCallback((course_id) => {
      fetch(`/api/files/${course_id}`)
        .then(response => response.json())
        .then(data => {
          dispatch({ type: 'RESET_FILES' });
          dispatch({ type: 'SET_FILES', payload: data });
        })
        .catch(error => console.error('Error fetching files:', error));
    }, [dispatch]);
    
    useEffect(() => {
      fetchFiles(course_id);
    }, [course_id, fetchFiles]);
    
    return (
      <div className="container-table">  
        <div className='table-container'>
          <div className='add-course-btn'>
            <h2>Files</h2>                
          </div>
          <Table columns={columns} dataSource={[...state.files]} rowKey={"id"}/>  
          <Modal  
            title="File Rating" 
            open={isModalOpen} 
            onOk={handleOk} 
            okText={ratingOkText}
            onCancel={handleCancel}
          >
            <div className='modal-rating'>
                <p>What is your rating for {selectedName}?</p>
                <Rate allowHalf onChange={(value) => setModalRating(value)} value={modalRating} />
            </div>
          </Modal> 

        </div>  
      </div>
    );
  }
  
  
  export default Course
  