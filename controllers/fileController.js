const db = require('../models/index.js');

const fetchCoursesFiles = async (course_id) => {
  
    try {
     
    console.log(course_id);

    const allCoursesWithFiles = await db.File.findAll({
        where: { course_id: course_id },
        include: [
            {
          model: db.Course,
          attributes: ['name']}
        ,
        {
            model: db.User,
            attributes: ['username'], 
          },
    ]
      });


     console.log(allCoursesWithFiles);
      
      return allCoursesWithFiles;
    } catch (error) {
      console.error("Error fetching files:", error);
      throw error;
    }
  };

module.exports = { fetchCoursesFiles };
