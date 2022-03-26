import { BCryptAdapter } from './bcrypt-adapter';
import bcrypt from 'bcrypt';

describe('BCrypt adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = new BCryptAdapter(12);
    const encrypt = jest.spyOn(bcrypt, 'hash');
    const value = 'valid_password';

    await sut.encrypt(value);

    expect(encrypt).toHaveBeenCalledWith(value, 12);
  });
});
