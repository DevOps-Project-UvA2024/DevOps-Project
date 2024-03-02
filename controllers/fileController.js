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
  const { course_id, user_id, username } = req.body;
  console.log("user_id", user_id)

  // Since `upload.any()` is used, `req.files` will hold the files
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  // Loop through all files if you're expecting multiple files
  try {
    const uploadPromises = req.files.map(async (file) => {
      const fileName = `${username}/${Date.now()}/${file.originalname}`;
      const fileType = file.mimetype;
      const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: fileType
      };

      // Upload file to S3
      await s3.upload(s3Params).promise();

      // After successful upload, store file metadata in RDS
      await db.File.create({
        name: fileName,
        upload_date: new Date(),
        active: true,
        course_id: course_id,
        uploader_id: user_id,
      });
    });

    await Promise.all(uploadPromises);
    res.json({ message: 'All files uploaded and metadata stored successfully' });
  } catch (error) {
    console.error('Error uploading file or storing metadata:', error);
    res.status(500).json({ error: 'Failed to upload file and store metadata' });
  }
};


module.exports = { fetchCoursesFiles, fetchLoggedUserRating, rateFileByLoggedUser, getSignedUrl, uploadFileAndStoreMetadata };
