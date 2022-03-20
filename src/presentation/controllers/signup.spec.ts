import { SignUpController } from '../controllers/signup';
import { MissingParamError } from '../errors/missing-param-error';
import { InvalidParamError } from '../errors/invalid-param-error';
import { EmailValidator } from '../protocols/email-validator';

interface Sut {
  sut: SignUpController
  emailValidatorStub: EmailValidator
};

const makeSut = (): Sut => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }

  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);

  return { sut, emailValidatorStub };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        password: 'passworld',
        password_confirmation: 'passworld'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'passworld',
        password_confirmation: 'passworld'
      }
    };
    const httResponse = sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        name: 'any_name',
        password_confirmation: 'passworld'
      }
    };
    const httResponse = sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no password_confirmation is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        name: 'any_name',
        password: 'passworld'
      }
    };
    const httResponse = sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('password_confirmation'));
  });

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'some_email@mail.com',
        password: 'passworld',
        password_confirmation: 'passworld'
      }
    };

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httResponse = sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new InvalidParamError('email'));
  });
});
