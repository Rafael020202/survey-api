import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols';
import { badRequest, success, serverError } from '../helpers/http-helper';
import { MissingParamError, InvalidParamError } from '../errors';

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredParams = ['email', 'name', 'password', 'password_confirmation'];
      const data = httpRequest.body;

      for (const parm of requiredParams) {
        if (!data[parm]) return badRequest(new MissingParamError(parm));
      }

      const isEmailValid = this.emailValidator.isValid(data.email);

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }

      if (data.password !== data.password_confirmation) {
        return badRequest(new InvalidParamError('password_confirmation'));
      }

      return success('');
    } catch (err) {
      return serverError();
    }
  }
};
