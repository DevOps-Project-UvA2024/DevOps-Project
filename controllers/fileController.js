const db = require('../models/index.js');

const fetchCoursesFiles = async (course_id) => {
  
    try {
     
    const allCoursesWithFiles = await db.File.findAll({
      where: { course_id: 1 },
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

module.exports = { fetchCoursesFiles };
