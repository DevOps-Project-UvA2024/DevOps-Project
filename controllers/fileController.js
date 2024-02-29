const db = require('../models/index.js');

const fetchCoursesFiles = async (course_id) => {
    try {
    const allCoursesWithFiles = await db.File.findAll({
      where: { course_id: course_id },
      include: [
        {
          model: db.Voting,
          as: 'votings',
          attributes: []
        }, {
          model: db.User,
          attributes: ['username']
        }],
      attributes: [
          'id',
          'name',
          'upload_date',
          [db.Sequelize.fn('AVG', db.Sequelize.col('votings.voting')), 'aggregate_voting']
        ],
        group: ['file.id']
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

const rateFileByLoggedUser = async (fileId, rating, email) => {
  const user = await db.User.findOne({email: email});
  userId = user.dataValues.id;
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

module.exports = { fetchCoursesFiles, fetchLoggedUserRating, rateFileByLoggedUser };
