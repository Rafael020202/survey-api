import { SignUpController } from './signup';
import { MissingParamError, InvalidParamError, ServerError } from '../../errors';
import { EmailValidator } from '../../protocols';
import { AddAccount, AddAccountModel, AccountModel } from './signup-protocols';

interface Sut {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
};

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = account;

      return await new Promise((resolve) => resolve({
        id: '1',
        created_at: new Date(),
        updated_at: new Date(),
        ...fakeAccount
      }));
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
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        password: 'passworld',
        password_confirmation: 'passworld'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'passworld',
        password_confirmation: 'passworld'
      }
    };
    const httResponse = await sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        name: 'any_name',
        password_confirmation: 'passworld'
      }
    };
    const httResponse = await sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no password_confirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'some_email@mail.com',
        name: 'any_name',
        password: 'passworld'
      }
    };
    const httResponse = await sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new MissingParamError('password_confirmation'));
  });

  test('Should return 400 if an invalid email is provided', async () => {
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

    const httResponse = await sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(400);
    expect(httResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Should return 500 if a server error occurred', async () => {
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

    const httResponse = await sut.handle(httpRequest);

    expect(httResponse.statusCode).toBe(500);
    expect(httResponse.body).toEqual(new ServerError());
  });

  test('Should return 400 if password is different from password_confirmation', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'somemail@mail.com',
        password: 'passworld',
        password_confirmation: 'passworldAround'
      }
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('password_confirmation'));
  });

  test('Should call addAccount with correct data', async () => {
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

    await sut.handle(httpRequest);

    expect(addACount).toBeCalledWith(httpRequest.body);
  });

  test('Should return 500 if addAccount throws error', async () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'somemail@mail.com',
        password: 'passworld',
        password_confirmation: 'passworld'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'jhondoe',
        email: 'jhondoe@mail.com',
        password: 'passworld',
        password_confirmation: 'passworld'
      }
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toHaveProperty('id');
  });
});
