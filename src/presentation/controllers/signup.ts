import { HttpRequest, HttpResponse } from '../protocols/http';
import { badRequest, success } from '../helpers/http-helper';
import { MissingParamError } from '../errors/missing-param-error';
import { InvalidParamError } from '../errors/invalid-param-error';
import { ServerError } from '../errors/server-error';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredParams = ['email', 'name', 'password', 'password_confirmation'];

      for (const parm of requiredParams) {
        if (!httpRequest.body[parm]) return badRequest(new MissingParamError(parm));
      }

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }

      return success('');
    } catch (err) {
      return {
        statusCode: 500,
        body: new ServerError()
      };
    }
  }
};
