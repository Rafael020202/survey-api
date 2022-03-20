export class MissingParamError extends Error {
  constructor (param: string) {
    super(`Missing ${param}`);
    this.name = 'MissingParamError';
  }
};
