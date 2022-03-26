import { Encrypter } from '../../data/protocols/encrypter';
import bcrypt from 'bcrypt';

export class BCryptAdapter implements Encrypter {
  constructor (
    private readonly salt: number
  ) {}

  async encrypt (password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.salt);

    return hashedPassword;
  }
};
