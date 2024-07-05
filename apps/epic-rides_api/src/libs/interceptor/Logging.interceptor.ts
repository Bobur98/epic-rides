import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger: Logger = new Logger();
	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// Observable is same with Promise but belongs to Functional Reactive programming not OOP like promise
		const recordTime = Date.now();
		const requestType = context.getType<GqlContextType>();

		if (requestType === 'http') {
			/** Develop if needed **/
		} else if (requestType === 'graphql') {
			/** (1) Print Request **/
			const gqlContext = GqlExecutionContext.create(context);
			this.logger.log(`${this.stringify(gqlContext.getContext().req.body)}`, 'INTERCEPTOR: REQUEST');

			/** (2) Errors handling via GraphQL **/

			/** (3) if No Errors => giving Response below **/
			return next.handle().pipe(
				tap((context) => {
					const responseTime = Date.now() - recordTime;
					this.logger.log(`${this.stringify(context)} - ${responseTime}ms \n\n`, 'INTERCEPTOR: RESPONSE');
				}),
			);
		}
	}

	private stringify(context: ExecutionContext): string {
		return JSON.stringify(context).slice(0, 75);
	}
}
