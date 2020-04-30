import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';

// import { loadingSagaMiddleware } from './saga.middleware';
import { loadingToolkitMiddleware } from './toolkit.middleware';
import { loadingThunkMiddleware } from './thunk.middleware';

export function createLoadingMiddleware({
  toolkit
}: RLM.Config): (
  store: MiddlewareAPI
) => (next: Dispatch) => (action: AnyAction) => AnyAction {
  if (toolkit) {
    return loadingToolkitMiddleware;
  }

  // case saga:
  //   return loadingSagaMiddleware;

  return loadingThunkMiddleware;
}

export const reduxLoadingMiddleware = (
  store: MiddlewareAPI = {} as MiddlewareAPI
): ((next: Dispatch) => (action: AnyAction) => AnyAction) =>
  createLoadingMiddleware({
    thunk: true,
    toolkit: false
    // saga: false
  })(store);
