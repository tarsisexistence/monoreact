import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';

import { isPromise } from '../helpers/utils';

export const pendingThunkMiddleware = ({ dispatch }: MiddlewareAPI) => (
  next: Dispatch
) => (action: AnyAction): AnyAction => {
  let promise;
  let data;

  if (action.payload) {
    const { payload } = action;

    if (isPromise(payload)) {
      promise = payload;
    } else if (isPromise(payload.promise)) {
      promise = payload.promise;
      data = payload.data;
    } else if (
      typeof payload === 'function' ||
      typeof payload.promise === 'function'
    ) {
      promise = payload.promise ? payload.promise() : payload();
      data = payload.promise ? payload.data : undefined;

      if (!isPromise(promise)) {
        return next({
          ...action,
          payload: promise
        });
      }
    } else {
      return next(action);
    }
  } else {
    return next(action);
  }

  const { type, meta } = action.type;
  const getAction = (newPayload: any) => {
    const nextAction: AnyAction = { type };

    if (newPayload !== null && typeof newPayload !== 'undefined') {
      nextAction.payload = newPayload;
    }

    if (meta !== undefined) {
      nextAction.meta = meta;
    }

    return nextAction;
  };
  const handleReject = (reason: any) => {
    const rejectedAction = getAction(reason);
    dispatch(rejectedAction);

    throw reason;
  };
  const handleFulfill = (value = null) => {
    const resolvedAction = getAction(value);
    dispatch(resolvedAction);

    return { value, action: resolvedAction };
  };

  next({
    type,
    // Include payload (for optimistic updates) if it is defined.
    ...(data !== undefined ? { payload: data } : {}),
    // Include meta data if it is defined.
    ...(meta !== undefined ? { meta } : {})
  });

  return promise.then(handleFulfill, handleReject);
};
