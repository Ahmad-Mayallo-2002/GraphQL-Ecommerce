import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQLExecptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const status = exception.getStatus();

      const error =
        typeof response === 'string'
          ? { message: response }
          : (response as object);

      return (
        new GraphQLError((error as any).message || 'Unexpected err'),
        {
          extensions: {
            code: exception.name.toUpperCase().replace('EXCEPTION', ''),
            statusCode: status,
            error,
          },
        }
      );
    }

    return new GraphQLError('Internal server error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
}
