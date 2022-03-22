import { EmailValidatorAdapter } from './email-validator';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true;
  }
}));

const makeEmailValidatorAdapter = (): EmailValidatorAdapter => {
  const emailValidatorAdapter = new EmailValidatorAdapter();

  return emailValidatorAdapter;
};

describe('EmailValidator Adapter', () => {
  test('Should return false if isValid returns false', () => {
    const emailValidatorAdapter = makeEmailValidatorAdapter();

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const email = 'email@live.com';
    const response = emailValidatorAdapter.isValid(email);

    expect(response).toBe(false);
  });

  test('Should return true if isValid returns true', () => {
    const emailValidatorAdapter = makeEmailValidatorAdapter();
    const email = 'email@live.com';
    const response = emailValidatorAdapter.isValid(email);

    expect(response).toBe(true);
  });

  test('Should call isValid with correct email', () => {
    const emailValidatorAdapter = makeEmailValidatorAdapter();
    const email = 'email@live.com';
    const isValid = jest.spyOn(emailValidatorAdapter, 'isValid');

    emailValidatorAdapter.isValid(email);

    expect(isValid).toBeCalledWith(email);
  });
});
