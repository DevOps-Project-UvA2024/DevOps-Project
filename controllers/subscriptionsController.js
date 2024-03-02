const db = require('../models/index.js');

const fetchAllSubscriptions = async (searchParameters, userId) => {
  
  searchParameters['student_id'] = userId;
  // Object.keys(searchParameters).forEach(key => {
  //   searchParameters[key] = { [db.Sequelize.Op.like]: `%${searchParameters[key]}%` };
  // });

  try {
    const allSubscriptions = await db.Subscription.findAll({
      where: searchParameters,
      includes:[
        {
          mode: db.Course,
          attributes: ['name', 'department']
        }
      ]
    });
    return allSubscriptions;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw error;
  }
};

module.exports = { fetchAllSubscriptions };
