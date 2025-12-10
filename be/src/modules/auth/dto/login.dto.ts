import { StringRequired } from 'src/common/decorators';

export class LogInDto {
  @StringRequired('Email')
  email: string;

  @StringRequired('Password')
  password: string;
}