import { SignUpController } from '../controllers/signup';
import { MissingParamError, InvalidParamError, ServerError } from '../errors';
import { EmailValidator } from '../protocols';
import { AddAccount, AddAccountModel } from '../../domain/useCases/add-account';
import { AccountModel } from '../../domain/models/account';

interface Sut {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
};

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = account;

      return {
        id: '1',
        created_at: new Date(),
        updated_at: new Date(),
        ...fakeAccount
      };
    }
  }

  const addAccountStub = new AddAccountStub();

  return addAccountStub;
};

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }

  const emailValidatorStub = new EmailValidatorStub();

  return emailValidatorStub;
};

const makeSut = (): Sut => {
  const emailValidatorStub = makeEmailValidatorStub();
  const addAccountStub = makeAddAccountStub();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return { sut, emailValidatorStub, addAccountStub };
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

  test('Should return 500 if a server error occurred', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'some_email@mail.com',
        password: 'passworld',
        password_confirmation: 'passworld'
      }
    };

    const httResponse = sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(500);
    expect(httResponse.body).toEqual(new ServerError());
  });

  test('Should return 400 if password is different from password_confirmation', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'somemail@mail.com',
        password: 'passworld',
        password_confirmation: 'passworldAround'
      }
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('password_confirmation'));
  });

  test('Should call addAccount with correct data', () => {
    const { sut, addAccountStub } = makeSut();
    const addACount = jest.spyOn(addAccountStub, 'add');
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'somemail@mail.com',
        password: 'passworld',
        password_confirmation: 'passworld'
      }
    };

    sut.handle(httpRequest);

    expect(addACount).toBeCalledWith(httpRequest.body);
  });
});
