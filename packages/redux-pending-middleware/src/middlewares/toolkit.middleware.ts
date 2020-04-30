import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';

import {
  REDUX_PENDING_MIDDLEWARE_FINISH_REQUEST,
  REDUX_PENDING_MIDDLEWARE_START_REQUEST
} from '../helpers/const';

export const pendingToolkitMiddleware = ({ dispatch }: MiddlewareAPI) => (
  next: Dispatch
) => {
  const actionRequestIds = new Map();

  return (action: AnyAction): AnyAction => {
    const requestId = action?.meta?.requestId;
    if (requestId !== undefined) {
      if (actionRequestIds.has(requestId)) {
        actionRequestIds.delete(requestId);
        dispatch({ type: REDUX_PENDING_MIDDLEWARE_FINISH_REQUEST });
      } else {
        actionRequestIds.set(requestId, 'pending');
        dispatch({ type: REDUX_PENDING_MIDDLEWARE_START_REQUEST });
      }
    }

    return next(action);
  };
};
