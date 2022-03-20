export class InvalidParamError extends Error {
  constructor (param: string) {
    super(`${param} invalid`);
    this.name = 'InvalidParamError';
  }
};
