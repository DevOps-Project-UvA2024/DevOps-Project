import React, { useEffect, useContext, useState, useCallback }from 'react';
import { Table, Button, Rate, Checkbox , Modal, message, Tooltip, Form, Input, Upload, Typography} from 'antd';
import { DownloadOutlined, StarOutlined, InboxOutlined } from '@ant-design/icons';
import StoreContext from '../store/StoreContext';
import "../styles/tables_style.css";
import FilterBar from '../components/FilterBar';
import { useNavigate} from 'react-router-dom';

const Course = () => {
  const { Dragger } = Upload;
  const { Text } = Typography;
  const navigate = useNavigate();

  const handleDownload = async (fileKey) => {
    try {

        // Call your backend to get the signed URL for download
        let fileKeySplit = fileKey.split("/");
        const response = await fetch(`/api/files/download/${fileKeySplit[0]}/${fileKeySplit[1]}/${fileKeySplit[2]}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        message.success("File will be downloaded shortly")
        // Create a temporary anchor `<a>` tag to programmatically click for download
        const downloadLink = document.createElement('a');
        downloadLink.href = data.url;
        downloadLink.setAttribute('download', ''); // Try to download instead of navigate
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink); // Clean up
    } catch (error) {
        console.error('Download error:', error);
        message.error('Download failed'); // Provide user feedback
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('username', state.user.username);
    formData.append('user_id', state.user.id);
    formData.append('course_id', parseInt(course_id));
  
    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      dispatch({ type: 'RESET_FILES' });
      fetchFiles(course_id);
      message.success(data.message);
      return data;
    } catch (error) {
      console.error(`Upload error: ${error}`);
      throw error;
    }
  };     
    
  const props = {
    name: 'file',
    multiple: true,
    beforeUpload: (file) => {
      // Add the selected file to the state without uploading it
      setSelectedFiles(currentFiles => [...currentFiles, file]);
      // Prevent `Upload` from automatically uploading the file
      return false;
    },
    onRemove: (file) => {
      // Remove the file from the state if it's deselected
      setSelectedFiles(currentFiles => currentFiles.filter(f => f.uid !== file.uid));
    },
    onChange(info) {
      console.log(info.file, info.fileList);
    },
  };

    // Handle changes in file visibility
    const onChange = async (checked, fileId) => {
      try {
        const response = await fetch(`/api/files/disabling/${fileId}`, {
          method: 'POST', // or PATCH depending on how your API is set up
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ active : checked }),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
    
        await response.json();
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

    let locale = {
      emptyText: 'This course has no files yet!',
    };


    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedName, setSelectedName] = useState('');
    const [modalRating, setModalRating] = useState(0);
    const [ratingOkText, setRatingOkText] = useState("Rate") ;
    const [modalFileId, setModalFileId] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    const resetModalState = () => {
      setSelectedFiles([]);
      setIsModalOpen(false);
      setIsUploadModalOpen(false);
    };


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
        render: (text) => text.split("/").pop()
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
        key: 'n_votes',
        align:'center'
      },
      {
        title: 'Your Rating',
        dataIndex: 'yourate',
        key: 'yourate',
        align:'center',
        render: (_, record) => (
            <Tooltip title={state.user && state.user.id === record.User.id ? "You cannot rate the file you uploaded!" : ''}>
              <Button  
                onClick={() => showNameModal(record.name, record.id)}
                disabled={state.user && state.user.id === record.User.id}
              >
                <StarOutlined /> Rate
              </Button>
            </Tooltip>
        ),

      },
      {
        title: 'Download',
        dataIndex: 'download',
        key: 'download',
        align: 'center',
        render: (_, record) => {
          //console.log(record)
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
        align: 'center',
        hidden: !state.user || state.user.role_id !== 2,
        render: (_, record) => (
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
      fetch(`/api/files/${course_id}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          }
        })
        .then(response => response.json())
        .then(data => {
          dispatch({ type: 'RESET_FILES' });
          dispatch({ type: 'SET_FILES', payload: data });
        })
        .catch(error => console.error('Error fetching files:', error));
    }, [dispatch]);
    
    useEffect(() => {
      fetchFiles(course_id);
      console.log(course_id)

    }, [course_id, fetchFiles]);

    const filters = [
      <Form.Item key="name" name="name" label="Name">
        <Input placeholder="Name" />
      </Form.Item>,
      <Form.Item key="voting" name="voting" label="Rating">
        <Rate allowHalf />
      </Form.Item>
    ];

    const showUploadModal = () => {
      setIsUploadModalOpen(true);
    }

    const handleUploadOk = () => {
      handleUpload().then(() => {
        resetModalState();
      }).catch(error => {
        console.error('An error occurred during the upload:', error);
      });
    };

    const handleUploadCancel = () => {
      setIsUploadModalOpen(false);
    };

    const goToCourseAnalytics = () => {
      navigate(`/courses/${course_id}/course-analytics`);

    };
    
    return (
      <div className="container-table">  
        <div className='table-container'>
          <div className='add-course-btn'>
            <h2>Files</h2> 
            <div>
              <Button type="primary" onClick={showUploadModal}>
                Upload File 
                
              </Button> 
              
              <Button 
                type="primary" 
                onClick={goToCourseAnalytics}>
                Course Analytics
              </Button>  
            </div> 
             
            <Modal title="Upload" open={isUploadModalOpen} onOk={handleUploadOk} onCancel={handleUploadCancel}>
              <p>Please upload a file here.</p>  
              <Dragger {...props} fileList={selectedFiles}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
              </Dragger>           
            </Modal>             
          </div>
          <FilterBar
            submitUrl={`/api/files/${course_id}`}
            filters={filters}
            type = 'FILES'
          />
          <Table locale={locale} columns={columns} dataSource={[...state.files]} rowKey={"id"}/>  
          <Modal  
            title="File Rating" 
            open={isModalOpen} 
            onOk={handleOk} 
            okText={ratingOkText}
            onCancel={handleCancel}>            
            <div className='modal-rating'>
              <p>What is your rating for <Text ellipsis={{ tooltip: selectedName.split("/").pop() }}>{selectedName.split("/").pop()}?</Text></p>
              <Rate allowHalf onChange={(value) => setModalRating(value)} value={modalRating} />
            </div>
          </Modal> 

        </div>  
      </div>
    );
  }

  
  
  export default Course
  