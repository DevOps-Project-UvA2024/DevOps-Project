// At the top of your tests/subscriptionsController.test.js file

jest.mock('../models', () => {
  return {
    Sequelize: { Op: { like: Symbol('like') } },
    Subscription: {
      findAll: jest.fn().mockResolvedValue([
        {
          id: 1,
          active: true,
          Course: {
            name: 'Advanced Testing',
            department: 'Computer Science',
          },
        },
      ]),
      findOne: jest.fn(),
      create: jest.fn(),
    },
    Course: {},
  };
});

// Import the functions you're testing
const { fetchAllSubscriptions, toggleSubscription } = require('../controllers/subscriptionsController');

describe('fetchAllSubscriptions', () => {
    it('fetches all subscriptions based on search parameters', async () => {
        // Assuming the setup correctly mocks the Subscription model's findAll method
        const searchParameters = { name: 'Advanced Testing' };
        const userId = 1;

        const subscriptions = await fetchAllSubscriptions(searchParameters, userId);

        // Assertions
        expect(subscriptions.length).toBeGreaterThan(0);
        expect(subscriptions[0].Course.name).toEqual('Advanced Testing');
        expect(subscriptions[0].Course.department).toEqual('Computer Science');
        expect(require('../models').Subscription.findAll).toHaveBeenCalled();
    });
});

describe('toggleSubscription', () => {
  it('updates an existing subscription', async () => {
    // Mock findOne to simulate finding an existing subscription
    require('../models').Subscription.findOne.mockResolvedValue({
      id: 1,
      active: false,
      save: jest.fn().mockResolvedValue({}),
    });

    const response = await toggleSubscription({ id: 2, active: true }, 1); // Assuming course ID 2

    // Check the save method was called, indicating the subscription was updated
    expect(response).toEqual('Subscribed to');
    expect(require('../models').Subscription.findOne).toHaveBeenCalledWith({
      where: { student_id: 1, id: 2 },
    });
  });

  it('creates a new subscription when none exists', async () => {
    // Mock findOne to return null, simulating no existing subscription found
    require('../models').Subscription.findOne.mockResolvedValue(null);

    const response = await toggleSubscription({ id: 3, active: true }, 1); // Assuming a new course ID 3

    // Check create was called, indicating a new subscription was created
    expect(response).toEqual('Subscribed to');
    expect(require('../models').Subscription.create).toHaveBeenCalledWith({
      active: true,
      course_id: 3,
      student_id: 1,
    });
  });
});
