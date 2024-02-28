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

module.exports = { fetchAllCourses };
