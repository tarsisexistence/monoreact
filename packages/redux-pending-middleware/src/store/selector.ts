import { REDUX_PENDING_MIDDLEWARE } from '../helpers/const';

export const selectPending = <TState>(state: TState): boolean =>
  (state as any)[REDUX_PENDING_MIDDLEWARE].isPending;
