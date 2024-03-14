jest.mock('../models', () => {
    const mockFindAll = jest.fn();
    const mockFindOrCreate = jest.fn();
    const mockCount = jest.fn();
    
    const mockSequelizeFn = jest.fn();
    const mockSequelizeCol = jest.fn().mockImplementation((columnName) => columnName);
    const mockSequelizeLiteral = jest.fn().mockImplementation((expression) => expression);
  
    return {
      Sequelize: {
        Op: {
          like: Symbol('like'),
          gte: Symbol('gte'),
        },
        fn: mockSequelizeFn,
        col: mockSequelizeCol, // Add this line to mock Sequelize.col
        literal: mockSequelizeLiteral, // Mocking Sequelize.literal
      },
      Course: {
        findAll: mockFindAll,
        findOrCreate: mockFindOrCreate,
      },
      File: {
        findAll: mockFindAll,
        count: mockCount,
      },
      Subscription: {
        count: mockCount,
      },
      User: {
        findAll: mockFindAll, // Assuming you might use findAll for User in getTopUploaders
        // Add any specific mocks for User model methods as necessary
      },
      // Mock other models or methods if necessary
    };
  });
const { 
    fetchAllCourses, 
    addCourse, 
    getTopUploaders, 
    getTopFiles, 
    getCourseAnalytics 
} = require('../controllers/courseController');

// Assuming models are correctly mocked at the top of the file as previously described

// Additional tests for getTopUploaders
describe('getTopUploaders', () => {
    it('retrieves top uploaders for a course', async () => {
      const mockTopUploadersData = [
        { uploader_id: 1, fileCount: 5, User: { username: 'UploaderOne' } },
      ];
      require('../models').File.findAll.mockResolvedValue(mockTopUploadersData);
  
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockReq = { params: { courseid: '1' } };
      
      await getTopUploaders(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockTopUploadersData);
      expect(require('../models').File.findAll).toHaveBeenCalledWith({
        where: { course_id: '1' },
        attributes: [
          'uploader_id',
          [require('../models').Sequelize.fn('COUNT', require('../models').Sequelize.col('uploader_id')), 'fileCount'],
        ],
        include: [{
          model: require('../models').User,
          attributes: ['username'],
        }],
        group: ['uploader_id', 'User.id'],
        order: [[require('../models').Sequelize.fn('COUNT', require('../models').Sequelize.col('uploader_id')), 'DESC']],
        limit: 5,
      });
    });
  });
  
  // Tests for getTopFiles
  describe('getTopFiles', () => {
    it('retrieves top files for a course based on ratings', async () => {
      const mockTopFilesData = [
        { id: 1, name: 'File1', totalVotes: 10, averageRating: 4.5 },
      ];
      require('../models').File.findAll.mockResolvedValue(mockTopFilesData);
  
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockReq = { params: { courseid: '1' } };
  
      await getTopFiles(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockTopFilesData);
      // Ensure the correct arguments were passed to findAll, similar to the setup in getTopUploaders
    });
  });
  
  // Tests for getCourseAnalytics
  describe('getCourseAnalytics', () => {
    it('retrieves analytics for a course', async () => {
      const mockAnalyticsData = {
        contributors: 3,
        subscribers: 2,
        contributionsPastWeek: 1,
        activeCourse: true,
      };
  
      require('../models').File.count.mockResolvedValueOnce(3); // For contributors
      require('../models').Subscription.count.mockResolvedValueOnce(2); // For subscribers
      require('../models').File.count.mockResolvedValueOnce(1); // For contributionsPastWeek
  
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockReq = { params: { courseid: '1' } };
  
      await getCourseAnalytics(mockReq, mockRes);
  
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockAnalyticsData);
      // Validate that count was called with the correct arguments for each metric
    });
  });

  // Describe block for fetchAllCourses tests
describe('fetchAllCourses', () => {
    it('fetches all courses based on search parameters', async () => {
      // Mock implementation for findAll in Course model
      const mockCourses = [
        { id: 1, name: 'Intro to Testing', department: 'Computer Science' },
      ];
      require('../models').Course.findAll.mockResolvedValue(mockCourses);
  
      const searchParameters = { name: 'Testing' };
      const userId = 1;
      const courses = await fetchAllCourses(searchParameters, userId);
  
      expect(courses).toEqual(mockCourses);
      expect(require('../models').Course.findAll).toHaveBeenCalledWith({
        where: searchParameters,
        include: [{
          model: require('../models').Subscription,
          where: { student_id: userId, active: true },
          required: false
        }]
      });
    });
  });
  
  // Describe block for addCourse tests
  describe('addCourse', () => {
    it('adds a new course', async () => {
      const mockCourseData = { id: 1, name: 'New Course', description: 'New course description', department: 'Science' };
      require('../models').Course.findOrCreate.mockResolvedValue([mockCourseData, true]);
  
      const newData = { course: 'New Course', description: 'New course description', department: 'Science' };
      const result = await addCourse(newData);
  
      expect(result[0]).toEqual(mockCourseData);
      expect(require('../models').Course.findOrCreate).toHaveBeenCalledWith({
        where: { name: newData.course },
        defaults: {
          description: newData.description,
          department: newData.department,
        },
      });
    });
  });