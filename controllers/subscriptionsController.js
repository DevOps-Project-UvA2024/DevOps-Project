const db = require('../models/index.js');

/**
 * Fetches all active subscriptions for a user based on given search parameters.
 * 
 * This function searches for subscriptions that match the given search parameters,
 * filtering by courses the user is actively subscribed to. It returns detailed information
 * about each subscription, including related course details.
 * 
 * @param {Object} searchParameters - Criteria to filter courses within subscriptions.
 * @param {number} userId - The ID of the user whose subscriptions are to be fetched.
 * @returns {Promise<Array>} A promise that resolves to an array of subscription objects, each containing course details.
 * @throws {Error} Throws an error if fetching the subscriptions fails.
 */
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

/**
 * Toggles a user's subscription status for a specific course.
 * 
 * This function either activates or deactivates a subscription for a course based on the provided data.
 * If a subscription exists, it updates the 'active' status; if not, it creates a new subscription entry with the given status.
 * The function returns a message indicating the result of the operation.
 * 
 * @param {Object} data - Contains the subscription 'id' and 'active' status to be updated or created.
 * @param {number} userId - The ID of the user whose subscription status is being toggled.
 * @returns {Promise<string>} A promise that resolves to a message indicating the subscription has been activated or deactivated.
 * @throws {Error} Throws an error if updating the subscription fails.
 */
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
