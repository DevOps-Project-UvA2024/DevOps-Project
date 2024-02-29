const db = require('../models/index.js');
const s3 = require('../amazon/s3.js');

const fetchCoursesFiles = async (role, course_id, inputParameters) => {

    let searchParameters = { course_id: course_id };
    let havingClause;

    Object.keys(inputParameters).forEach(key => {
      if (typeof inputParameters[key] === 'string') {
        searchParameters[key] = { [db.Sequelize.Op.like]: `%${inputParameters[key]}%` };
      }
    });

    Object.keys(inputParameters).forEach(key => {
      if (key === 'voting') {
        havingClause = db.Sequelize.where(
          db.Sequelize.fn('AVG', db.Sequelize.col('votings.voting')),
          { [db.Sequelize.Op.gte]: Number(inputParameters[key]) }
        );
      }
    });

    if (role !== 2){
      searchParameters = { ...searchParameters, active: true}
    }

    try {
    const allCoursesWithFiles = await db.File.findAll({
      where: searchParameters,
      include: [
        {
          model: db.Voting,
          as: 'votings',
          attributes: []
        }, {
          model: db.User,
          attributes: ['username', 'id']
        }],
      attributes: [
          'id',
          'name',
          'upload_date',
          [db.Sequelize.fn('AVG', db.Sequelize.col('votings.voting')), 'aggregate_voting'],
          [db.Sequelize.fn('COUNT', db.Sequelize.col('votings.id')), 'n_votes'],
          'active' 
        ],
        group: ['file.id'],
        having: havingClause
      });
      
      return allCoursesWithFiles;
    } catch (error) {
      console.error("Error fetching files:", error);
      throw error;
    }
  };

const fetchLoggedUserRating = async (fileId, email) => {
  try {
    const userRating = await db.Voting.findOne({
      where: {
        file_id: fileId
      }, 
      include: [
        {
          model: db.User,
          where: {email: email},
          attributes: [],
        }],
      attributes: ['voting']
    });

    return userRating;
  } catch (error) {
    console.error("Error fetching user rating:", error);
    throw error;
  }
}

const rateFileByLoggedUser = async (fileId, rating, userId) => {

  try {
    const userRating = await db.Voting.findOne({
      where: {
        file_id: fileId,
        student_id: userId
      }
    });

    if (userRating) {
      return await db.Voting.update({voting: rating},{
        where: {
          file_id: fileId,
          student_id: userId
        }}
      );
    } else {
      return await db.Voting.create({
        file_id: fileId,
        student_id: userId,
        voting: rating
      })
    }
  } catch (error) {
    console.error("Error posting user rating:", error);
    throw error;
  }
}

const getSignedUrl = (bucket, fileKey) => {
  const params = {
    Bucket: bucket,
    Key: fileKey,
    Expires: 60
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
};

const uploadFileAndStoreMetadata = async (req, res) => {
  const { file } = req; // Assuming file is available in req.file (e.g., using multer for file handling)
  const { courseId, uploaderId } = req.body; // Additional data sent along with the file

  if (!file || !courseId || !uploaderId) {
    return res.status(400).send('Missing file or metadata');
  }

  const fileName = `${uploaderId}/${Date.now()}/${file.originalname}`;
  const fileType = file.mimetype;
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: fileType,
    ACL: 'public-read', // adjust the ACL according to your needs
  };

  // Upload file to S3
  try {
    await s3.upload(s3Params).promise();

    // After successful upload, store file metadata in RDS
    const newFile = await db.File.create({
      name: fileName,
      type: fileType,
      upload_date: new Date(),
      active: true,
      course_id: courseId,
      uploader_id: uploaderId,
    });

    res.json({ message: 'File uploaded and metadata stored successfully' });
  } catch (error) {
    console.error('Error uploading file or storing metadata:', error);
    res.status(500).json({ error: 'Failed to upload file and store metadata' });
  }
};

module.exports = { fetchCoursesFiles, fetchLoggedUserRating, rateFileByLoggedUser, getSignedUrl, uploadFileAndStoreMetadata };
