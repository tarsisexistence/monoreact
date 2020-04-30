import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';

// import { pendingSagaMiddleware } from './saga.middleware';
import { pendingToolkitMiddleware } from './toolkit.middleware';
import { pendingThunkMiddleware } from './thunk.middleware';

export function createPendingMiddleware({
  toolkit
}: RPM.Config): (
  store: MiddlewareAPI
) => (next: Dispatch) => (action: AnyAction) => AnyAction {
  if (toolkit) {
    return pendingToolkitMiddleware;
  }

  // case saga:
  //   return pendingSagaMiddleware;

  return pendingThunkMiddleware;
}

export const reduxPendingMiddleware = (
  store: MiddlewareAPI = {} as MiddlewareAPI
): ((next: Dispatch) => (action: AnyAction) => AnyAction) =>
  createPendingMiddleware({
    thunk: false,
    toolkit: true
    // saga: false
  })(store);
