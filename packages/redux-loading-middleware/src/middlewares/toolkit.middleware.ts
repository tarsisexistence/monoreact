import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';

import {
  REDUX_LOADING_MIDDLEWARE_FINISH_LOADING,
  REDUX_LOADING_MIDDLEWARE_START_LOADING
} from '../helpers/const';

export const loadingToolkitMiddleware = ({ dispatch }: MiddlewareAPI) => (
  next: Dispatch
) => {
  const actionRequestIds = new Map();

  return (action: AnyAction): AnyAction => {
    const requestId = action?.meta?.requestId;
    if (requestId !== undefined) {
      if (actionRequestIds.has(requestId)) {
        actionRequestIds.delete(requestId);
        dispatch({ type: REDUX_LOADING_MIDDLEWARE_FINISH_LOADING });
      } else {
        actionRequestIds.set(requestId, 'pending');
        dispatch({ type: REDUX_LOADING_MIDDLEWARE_START_LOADING });
      }
    }

    return next(action);
  };
};
