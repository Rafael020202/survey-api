import { SignUpController } from '../controllers/signup';

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const signUpController = new SignUpController();
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        password: 'passworld',
        password_confirmation: 'passworld'
      }
    };
    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing name param'));
  });
});
