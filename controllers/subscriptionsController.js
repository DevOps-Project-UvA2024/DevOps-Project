const db = require('../models/index.js');

const fetchAllSubscriptions = async (searchParameters, userId) => {

  Object.keys(searchParameters).forEach(key => {
    searchParameters[key] = { [db.Sequelize.Op.like]: `%${searchParameters[key]}%` };
  });

  const nameParameters = {
    student_id: userId,
    active: true
  };

  try {
    const allSubscriptions = await db.Subscription.findAll({
      where: nameParameters,
      include:[
        {
          model: db.Course,
          attributes: ['name', 'department', 'id'],
          where: searchParameters
        }
      ],
      attributes:[
        'id',
        'active'
      ]
    });
    return allSubscriptions;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    console.log(error);
  }
};

const toggleSubscription = async (data, userId) => {
  try {
    const subscription = await db.Subscription.findOne({
      where: {
        student_id: userId,
        id: data.id
      }
    });
    if (subscription) {
      subscription.active = data.active;
      await subscription.save();
    } else {
      await db.Subscription.create({
        active: data.active,
        course_id: data.id,
        student_id: userId
      });
    }
    if (data.active) return "Subscribed to";
    return "Unsubscribed from";
  } catch (error) {
    console.log(error);
    return error
  }
}

module.exports = { fetchAllSubscriptions, toggleSubscription };
