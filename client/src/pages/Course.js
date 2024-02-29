import React, { useEffect, useContext, useState, useCallback }from 'react';
import { Table, Button, Rate, Checkbox , Modal, message, Tooltip} from 'antd';
import { DownloadOutlined,StarOutlined } from '@ant-design/icons';
import StoreContext from '../store/StoreContext';

import "../styles/tables_style.css"


const Course = () => {

  const handleDownload = async (fileKey) => {
    try {
        // Call your backend to get the signed URL for download
        const response = await fetch(`/api/files/download/${fileKey}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Create a temporary anchor `<a>` tag to programmatically click for download
        const downloadLink = document.createElement('a');
        downloadLink.href = data.url;
        downloadLink.setAttribute('download', ''); // Try to download instead of navigate
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink); // Clean up
    } catch (error) {
        console.error('Download error:', error);
        alert('Download failed'); // Provide user feedback
    }
  };
  
    
    // Handle changes in file visibility
    const onChange = async (checked, fileId) => {
      try {
        const response = await fetch(`/api/files/disabling/${fileId}`, {
          method: 'POST', // or PATCH depending on how your API is set up
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isVisibleToNonAdmins: checked }),
        });
        console.log(response);
    
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
    
        const result = await response.json();
        message.success(`Status updated for file ID: ${fileId}`);
    
        // Dispatch an action to update your front-end state, if necessary
        // For example, you might want to refetch the files list or update a specific item
        fetchFiles(course_id);
    
      } catch (error) {
        console.error('Failed to update status:', error);
        message.error('Failed to update status.');
      }
    };

    const { state, dispatch } = useContext(StoreContext);

    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedName, setSelectedName] = useState('');
    const [modalRating, setModalRating] = useState(0);
    const [ratingOkText, setRatingOkText] = useState("Rate") ;
    const [modalFileId, setModalFileId] = useState(null);
    const [filesStatus, setFilesStatus] = useState([]);


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
        title: 'Number of Ratings',
        dataIndex: 'n_votes',
        key: 'rating',
        align:'center'
      },
      {
        title: 'Your Rating',
        dataIndex: 'yourate',
        key: 'yourate',
        align:'center',
        render: (_, record) => (
          <>
            <Tooltip title={state.user && state.user.id === record.User.id ? "You cannot rate the file you uploaded!" : ''}>
              <Button  
                onClick={() => showNameModal(record.name, record.id)}
                disabled={state.user && state.user.id === record.User.id}
              >
                <StarOutlined />Rate
              </Button>
            </Tooltip>
          </>
        ),

      },
      {
        title: 'Download',
        dataIndex: 'download',
        key: 'download',
        align: 'center',
        render: (_, record) => {
          console.log(record)
          return <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.name)}
          />
        },
      },


      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        hidden: !state.user || state.user.role_id !== 2,
        render: (text, record) => (
          <Checkbox 
            checked={record.active} 
            onChange={(e) => onChange(e.target.checked, record.id)} 
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
  