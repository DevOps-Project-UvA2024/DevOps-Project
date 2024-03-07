import React, { useEffect, useState, useCallback }from 'react';
import { Rate } from 'antd';
import { useParams } from 'react-router-dom';
import "../styles/analytics.css"
import firstPrizeImage from '../images/firstPrize.png';
import secondPrizeImage from '../images/secondPrize.png';
import thirdPrizeImage from '../images/thirdPrize.png';

const CourseAnalytics = () => {
    const { courseid } = useParams(); 
    const [topUploaders, setTopUploaders] = useState([]);
    const [topFiles, setTopFiles] = useState([]);
    const [loadingTopUploaders, setLoadingTopUploaders] = useState(true);
    const [loadingTopFiles, setLoadingTopFiles] = useState(true);
    
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
        console.log(data)
          setTopFiles(data);
          setLoadingTopFiles(false);
      })
      .catch(error => console.error('Error fetching files:', error));
      }, [courseid]);

      useEffect(() => {
        fetchTopUploaders();
        fetchTopFiles();
    }, [fetchTopUploaders, fetchTopFiles]);

    const getPrizeImage = (index) => {
        switch (index) {
            case 0: return firstPrizeImage;
            case 1: return secondPrizeImage;
            case 2: return thirdPrizeImage;
            default: return null;
        }
    };

    return (
        <div className='course-analytics'>
            <h2>Course Analytics</h2>
            <div className="tables-containers">
                <div className="top5users">
                    <h3>Top 5 Users</h3>
                    {loadingTopUploaders ? <p>Loading...</p> : topUploaders.map((uploader, index) => (
                        <div key={uploader.key} className="uploader-info">
                            <div className='image-container'>                            
                                {index < 3 && <img src={getPrizeImage(index)} alt={`Prize ${index + 1}`} />}
                            </div>
                            <div className="info">
                                <div className="title">@{uploader.username}</div>
                                <div><span className='no-uploads'>{uploader.fileCount}</span> total upload(s)</div>
                            </div>

      
                        </div>
                    ))}
                </div>

                <div className="top5files">
                    <h3>Top 5 Uploads</h3>
                    {!loadingTopFiles && topFiles.map((file, index) => (
                        <div key={index} className="file-info">
                            <p className="title">{file.name.split("/").pop()}</p>
                            <div className="rating-all"><Rate disabled allowHalf defaultValue={Math.round(Number(file.averageRating) * 2) / 2}  />({file.totalVotes})</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      );
}

export default CourseAnalytics