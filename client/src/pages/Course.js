import React,  { useState } from 'react';
import { Table, Button, Rate, Checkbox , Modal} from 'antd';
import { DownloadOutlined,StarOutlined } from '@ant-design/icons';
import "../styles/tables_style.css"


const Course = () => {
    
    //const navigate = useNavigate();

    const onChange = (checked, recordKey) => {
      console.log(`checked = ${checked}, key = ${recordKey}`);
    };

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
        dataIndex: 'uploadedby',
        key: 'uploadedby',
        sorter: (a, b) => a.uploadedby.localeCompare(b.uploadedby),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sorter: (a, b) => a.uploadedby.localeCompare(b.uploadedby),

      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating',
        render: rating => <Rate disabled defaultValue={rating} />,
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

    const data = [
      {
        key: '1',
        name: 'Programming Basics.pdf',
        date: '2024-02-28 15:00:29',
        uploadedby: 'Mariana',
        rating:3,
        status: false
      },
      {
        key: '2',
        name: 'AProgramming Basics.pdf',
        date: '2023-02-28 15:00:29',
        uploadedby: 'AMariana',
        rating:5,
        status: true

      }
      
    ];


    
    const handleRateChange = (value) => {
      //setModalRating(value);
    };
    
  
    
    return (
      <div className="container-table">  
        <div className='table-container'>
          <div className='add-course-btn'>
            <h2>Files</h2>                
          </div>
          <Table columns={columns} dataSource={data}/>  
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
  