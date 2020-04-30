import { REDUX_PENDING_MIDDLEWARE } from '../helpers/const';

export function selectPending<TStore>(
  store: TStore & {
    [REDUX_PENDING_MIDDLEWARE]: RPM.State;
  }
): boolean {
  return store[REDUX_PENDING_MIDDLEWARE].isPending;
}
