const db = require('../models/index.js');

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

module.exports = { fetchAllCourses, addCourse };
