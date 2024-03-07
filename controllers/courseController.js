const db = require('../models/index.js');
const moment = require('moment');

const fetchAllCourses = async (searchParameters, userId) => {
  
  Object.keys(searchParameters).forEach(key => {
    searchParameters[key] = { [db.Sequelize.Op.like]: `%${searchParameters[key]}%` };
  });

  try {
    const allCourses = await db.Course.findAll({
      where: searchParameters,
      include: [{
        model: db.Subscription,
        where: {
          student_id: userId,
          active: true
        },
        required: false
      }]
    });
    return allCourses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

const addCourse = async (data) => {
  try {
      const result = await db.Course.findOrCreate({
          where: { name: data.course },
          defaults: {
            description: data.description,
            department: data.department
          }
      });

      return result;
  } catch (error) {
      console.error("Error adding course:", error);
      throw error;
  }
}

const getTopUploaders = async (req,res) =>{
  try {
    const { courseid } = req.params;   
    const topUploaders = await db.File.findAll({
      where: { course_id: courseid }, // Use the correct field name from the "files" table
      attributes: [
        'uploader_id',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('uploader_id')), 'fileCount'],
      ],
      include: [{
        model: db.User,
        attributes: ['username'], 
      }],
      group: ['uploader_id', 'User.id'],
      order: [[db.Sequelize.fn('COUNT', db.Sequelize.col('uploader_id')), 'DESC']], // Corrected order clause
      limit: 5,
    });

    res.status(200).json(topUploaders);
  } catch (error) {
    console.log(error);
  }
}

const getTopFiles = async (req,res) =>{
  try {
    const { courseid } = req.params;   
    const topRatedFiles = await db.File.findAll({
      where: { course_id: courseid },
      attributes: [
        'id',
        'name',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('votings.id')), 'totalVotes'],
        [db.Sequelize.fn('AVG', db.Sequelize.col('votings.voting')), 'averageRating'],
      ],
      include: [{
        model: db.Voting,
        attributes: [],
        as: 'votings',
        required: false
      }],
      group: [db.Sequelize.col('File.id')],
      having: db.Sequelize.literal('COUNT(`votings`.`id`) > 0'),
      order: [
        [db.Sequelize.literal('averageRating'), 'DESC']
      ],
      limit: 5,
      subQuery: false
    });    

    res.status(200).json(topRatedFiles);
  } catch (error) {
    console.log(error);
  }
}

const getCourseAnalytics = async (req,res) =>{
  try {
    const { courseid } = req.params;   
    const courseContributors = await db.File.count({
      where: { course_id: courseid },
      distinct: true,
      col: 'uploader_id'
    });

    const courseSubscribers = await db.Subscription.count({
      where: { course_id: courseid },
      col: 'student_id'
    });

    const contributionsPastWeek  = await db.File.count({
      where: {
        course_id: courseid,
        upload_date: {
          [db.Sequelize.Op.gte]: moment().subtract(7, 'days').toDate()
        }
      }
    });

    res.status(200).json({
      contributors: courseContributors, 
      subscribers: courseSubscribers,
      contributionsPastWeek: contributionsPastWeek,
      activeCourse: contributionsPastWeek > 0
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { fetchAllCourses, addCourse, getTopUploaders, getTopFiles, getCourseAnalytics };
