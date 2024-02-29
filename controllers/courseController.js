const db = require('../models/index.js');

const fetchAllCourses = async () => {
    try {
      const allCourses = await db.Course.findAll();
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
