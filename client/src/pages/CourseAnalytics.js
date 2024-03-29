import React, { useEffect, useState, useCallback }from 'react';
import { Rate } from 'antd';
import { useParams } from 'react-router-dom';
import "../styles/analytics.css"
import firstPrizeImage from '../images/firstPrize.png';
import secondPrizeImage from '../images/secondPrize.png';
import thirdPrizeImage from '../images/thirdPrize.png';
import fireImage from '../images/fire.png'
import iceImage from '../images/ice.png'


const CourseAnalytics = () => {
    const { courseid } = useParams(); 
    const [topUploaders, setTopUploaders] = useState([]);
    const [topFiles, setTopFiles] = useState([]);
    const [mainCourseAnalytics, setMainCourseAnalytics] = useState({});
    const [loadingTopUploaders, setLoadingTopUploaders] = useState(true);
    const [loadingTopFiles, setLoadingTopFiles] = useState(true); 

    // Requests top uploaders from the server
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

    // Requests top files from the server
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

    // Requests overall subscriptions, contributors, contributions from 7 days and activity status of course from the server
    const fetchMainCourseAnalytics = useCallback(() => {
        fetch(`/api/courses/${courseid}/course-analytics/main-course-analytics`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            setMainCourseAnalytics(data);
        })
        .catch(error => console.error('Error fetching files:', error));
    }, [courseid]);

    useEffect(() => {
        fetchTopUploaders();
        fetchTopFiles();
        fetchMainCourseAnalytics();
    }, [fetchTopUploaders, fetchTopFiles, fetchMainCourseAnalytics]);

    // Maps prizes to indexes for top uploaders
    const getPrizeImage = (index) => {
        switch (index) {
            case 0: return firstPrizeImage;
            case 1: return secondPrizeImage;
            case 2: return thirdPrizeImage;
            default: return null;
        }
    };

    // If the status of the course is active then add a fire image, if not an ice image
    const imageSrc = mainCourseAnalytics.contributionsPastWeek ? fireImage : iceImage;

    return (
        <div className='course-analytics'>
            <h2 className="main-title">
                Course Analytics 
            </h2>
            <div className='all-analytics'>
                <div className='overview'>
                    <div className='overview-columns'>
                        <div className='overview-data'>{mainCourseAnalytics.subscribers}</div> 
                        <div className='overview-titles'>Subscribers</div>


                    </div>
                    <div className='overview-columns'>
                        <div className='overview-data'>{mainCourseAnalytics.contributors}</div> 

                        <div className='overview-titles'>Contributors</div>
                    </div>

                    <div className='overview-columns'>
                        <div className='overview-data'>{mainCourseAnalytics.contributionsPastWeek} <img src={imageSrc}  className='activeness' alt=""/>
                    </div> 
                        <div className='overview-titles'>Posts last week</div>
                    </div>

                </div>
                <div className="tables-containers">
                    <div className="top5users">
                        <h3>Top 5 Contributors</h3>
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
                        {!loadingTopFiles && topFiles.map((file) => (
                            <div key={file.name} className="file-info">
                                <p className="title">{file.name.split("/").pop()}</p>
                                <div className="rating-all"><Rate disabled allowHalf defaultValue={Math.round(Number(file.averageRating) * 2) / 2}  />({file.totalVotes})</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            
        </div>
      );
}

export default CourseAnalytics