import { ExecutionContext } from "./execution-context";
import { Result } from "../dto/result";

export interface Command<TResult = void> {
  readonly _brand: "Command"; // Branded type for strict CQRS boundary
}

export interface Query<TResult> {
  readonly _brand: "Query";
}

export interface CommandHandler<TCommand extends Command<TResult>, TResult = void> {
  handle(command: TCommand, context: ExecutionContext): Promise<Result<TResult>>;
}

export interface QueryHandler<TQuery extends Query<TResult>, TResult> {
  handle(query: TQuery, context: ExecutionContext): Promise<Result<TResult>>;
}
