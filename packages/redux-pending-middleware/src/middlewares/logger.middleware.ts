import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';

export const logger = (store: MiddlewareAPI) => (next: Dispatch) => (
  action: AnyAction
) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};
