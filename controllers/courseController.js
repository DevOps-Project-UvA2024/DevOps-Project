const db = require('../models/index.js');
const moment = require('moment');

/**
 * Fetches all courses based on search parameters and filters them by user subscription.
 * 
 * @param {Object} searchParameters - Criteria to filter courses (e.g., name, department).
 * @param {number} userId - The ID of the user to filter subscribed courses.
 * @returns {Promise<Array>} A promise that resolves to an array of all matching courses.
 * @throws {Error} Throws an error if fetching courses fails.
 */
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

/**
 * Adds a new course if it does not exist in the database.
 * 
 * @param {Object} data - Course data including name, description, and department.
 * @returns {Promise<Object>} A promise that resolves to the result of the findOrCreate operation.
 * @throws {Error} Throws an error if adding the course fails.
 */
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

/**
 * Retrieves the top 5 uploaders for a given course based on the file count.
 * 
 * @param {Object} req - Express request object, containing the course ID as a parameter.
 * @param {Object} res - Express response object, used to send the top uploaders data.
 * @throws {Error} Throws an error if fetching top uploaders fails.
 */
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

/**
 * Retrieves the top 5 rated files for a given course based on votes.
 * 
 * @param {Object} req - Express request object, containing the course ID as a parameter.
 * @param {Object} res - Express response object, used to send the top files data.
 * @throws {Error} Throws an error if fetching top-rated files fails.
 */
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

/**
 * Provides analytics for a given course, including the number of contributors, subscribers,
 * and contributions made in the past week, along with an activity status.
 * 
 * @param {Object} req - Express request object, containing the course ID as a parameter.
 * @param {Object} res - Express response object, used to send course analytics data.
 * @throws {Error} Throws an error if fetching course analytics fails.
 */
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
