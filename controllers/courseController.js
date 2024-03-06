const db = require('../models/index.js');

const fetchAllCourses = async (searchParameters) => {
  
  Object.keys(searchParameters).forEach(key => {
    searchParameters[key] = { [db.Sequelize.Op.like]: `%${searchParameters[key]}%` };
  });

  try {
    const allCourses = await db.Course.findAll({
      where: searchParameters
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
      //order: [[Sequelize.fn('COUNT', Sequelize.col('uploader_id')), 'DESC']], // Corrected order clause
      limit: 5,
    });

    res.status(200).json(topUploaders);

  } catch (error) {
    
    console.log(error);

  }
}

module.exports = { fetchAllCourses, addCourse, getTopUploaders };
