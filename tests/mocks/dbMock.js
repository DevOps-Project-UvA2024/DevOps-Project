const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Mocking the Course model
const CourseMock = dbMock.define('Course', {
    id: 1,
    name: 'Intro to Testing',
    description: 'A course about testing principles',
    department: 'Computer Science',
});

const SubscriptionMock = dbMock.define('Subscription', {
    id: 1,
    active: true,
});

SubscriptionMock.belongsTo(CourseMock, { as: 'Course' });

module.exports = {
    db: dbMock,
    Subscription: SubscriptionMock,
    Course: CourseMock,
};
