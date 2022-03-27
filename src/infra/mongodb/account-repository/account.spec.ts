import { MongoHelper } from '../helpers/mongo-helper';
import { AccountRepository } from './account';

const makeSut = (): AccountRepository => {
  const sut = new AccountRepository();

  return sut;
};

describe('Account mongodb repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.close();
  });

  test('Should return an account on success', async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email');
    expect(account.password).toBe('any_password');
  });
});
