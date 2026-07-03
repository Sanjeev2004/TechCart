import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken';

// Mock the Response object
const mockResponse = () => {
  const res: any = {};
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('generateToken Utility', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, JWT_SECRET: 'testsecret', NODE_ENV: 'development' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should generate a token and set it as an HTTP-only cookie', () => {
    const res = mockResponse();
    const userId = '507f1f77bcf86cd799439011';

    generateToken(res, userId);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenCalledWith(
      'jwt',
      expect.any(String), // The JWT token
      expect.objectContaining({
        httpOnly: true,
        secure: false, // Because NODE_ENV is development
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
    );
  });
});
