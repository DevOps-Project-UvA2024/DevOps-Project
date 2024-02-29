const db = require('../models/index.js');

const fetchCoursesFiles = async (role, course_id, inputParameters) => {

    let searchParameters = { course_id: course_id }

    Object.keys(inputParameters).forEach(key => {
      if (typeof inputParameters[key] === 'string') {
        searchParameters[key] = { [db.Sequelize.Op.like]: `%${inputParameters[key]}%` };
      }
    });

    if (role !== 2){
      searchParameters = { ...searchParameters, active: true}
    }

    console.log(searchParameters)
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
          [db.Sequelize.fn('COUNT', db.Sequelize.col('votings.id')), 'n_votes'] 
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

module.exports = { fetchCoursesFiles, fetchLoggedUserRating, rateFileByLoggedUser };
