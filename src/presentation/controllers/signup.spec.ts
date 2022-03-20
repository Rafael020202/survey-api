import { SignUpController } from '../controllers/signup';
import { MissingParamError } from '../errors/missing-param-error';

describe('SignUp Controller', () => {
  const signUpController = new SignUpController();

  test('Should return 400 if no name is provided', () => {
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        password: 'passworld',
        password_confirmation: 'passworld'
      }
    };
    const httpResponse = signUpController.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'passworld',
        password_confirmation: 'passworld'
      }
    };
    const httResponse = signUpController.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        name: 'any_name',
        password_confirmation: 'passworld'
      }
    };
    const httResponse = signUpController.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no password_confirmation is provided', () => {
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        name: 'any_name',
        password: 'passworld'
      }
    };
    const httResponse = signUpController.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('password_confirmation'));
  });
});
