import { ConsoleLogger, LoggerService } from '@nestjs/common';

export class CustomLoggerService
  extends ConsoleLogger
  implements LoggerService
{
  constructor() {
    super();
  }

  log(message: any, ...optionalParams: any[]) {
    const formattedMessage = `[CustomLogger] ${message}`;
    super.log(formattedMessage, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    super.error(message, ...optionalParams);
  }

  fatal(message: any, ...optionalParams: any[]) {
    super.fatal(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    super.warn(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    super.debug(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(message, ...optionalParams);
  }
}
