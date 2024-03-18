const db = require('../models/index.js');
const s3 = require('../amazon/s3.js');

/**
 * Fetches course files based on provided search parameters and the role of the user.
 * 
 * @param {number} role - The role ID of the user (e.g., 2 for admin).
 * @param {number} course_id - The ID of the course to fetch files from.
 * @param {Object} inputParameters - Additional search parameters for filtering files.
 * @returns {Promise<Array>} A promise that resolves to an array of course files matching the search criteria.
 * @throws {Error} Throws an error if fetching files fails.
 */
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
        group: ['id'],
        having: havingClause
      });
      
      return allCoursesWithFiles;
    } catch (error) {
      console.error("Error fetching files:", error);
      throw error;
    }
  };

/**
 * Fetches the rating a logged-in user has given to a specific file.
 * 
 * @param {number} fileId - The ID of the file to fetch the rating for.
 * @param {number} userId - The ID of the user whose rating is to be fetched.
 * @returns {Promise<Object|null>} A promise that resolves to the user's rating for the file or null if not rated.
 * @throws {Error} Throws an error if fetching the rating fails.
 */
const fetchLoggedUserRating = async (fileId, userId) => {
  try {
    const userRating = await db.Voting.findOne({
      where: {
        file_id: fileId,
        student_id: userId
      }, 
      attributes: ['voting']
    });

    return userRating;
  } catch (error) {
    console.error("Error fetching user rating:", error);
    throw error;
  }
}

/**
 * Allows a logged-in user to rate a file, updating the rating if it already exists or creating a new one otherwise.
 * 
 * @param {number} fileId - The ID of the file to be rated.
 * @param {number} rating - The rating value.
 * @param {number} userId - The ID of the user rating the file.
 * @returns {Promise<Object>} A promise that resolves to the outcome of the rating operation.
 * @throws {Error} Throws an error if the rating operation fails.
 */
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

/**
 * Generates a signed URL for accessing a file stored in an AWS S3 bucket.
 * 
 * @param {string} bucket - The name of the S3 bucket.
 * @param {string} fileKey - The key of the file in the bucket.
 * @returns {Promise<string>} A promise that resolves to a signed URL for the file.
 * @throws {Error} Throws an error if generating the signed URL fails.
 */
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

/**
 * Handles the upload of files to AWS S3 and stores their metadata in a database.
 * 
 * @param {Object} req - The request object, containing the file(s) to upload and metadata.
 * @param {Object} res - The response object, used to send back the upload result.
 * @throws {Error} Throws an error if file upload or metadata storage fails.
 */
const uploadFileAndStoreMetadata = async (req, res) => {
  const { course_id, user_id, username } = req.body;

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
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: fileType,
        ContentDisposition: "attachment"
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
