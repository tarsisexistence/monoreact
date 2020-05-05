/**
 * some code was borrowed from this:
 * https://github.com/pburtchaell/redux-promise-middleware/blob/master/src/index.js
 */
import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';

import { isPromise } from '../helpers/utils';
import { patchEffect } from '../store/actions';
import { nanoid } from '../helpers/nanoid.utils';

export const pendingPromiseMiddleware = ({ dispatch }: MiddlewareAPI) => (
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
      // when the promise returned by async function
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

  const { type, meta } = action;
  const effectId = nanoid();

  const getAction = (newPayload: any, isRejected: boolean): AnyAction => {
    const nextAction: AnyAction = {
      type: isRejected ? `${type}_REJECTED` : `${type}_FULFILLED`
    };

    if (newPayload !== null && typeof newPayload !== 'undefined') {
      nextAction.payload = newPayload;
    }

    if (meta !== undefined) {
      nextAction.meta = meta;
    }

    if (isRejected) {
      nextAction.error = true;
    }

    return nextAction;
  };
  const handleReject = (reason: any) => {
    const rejectedAction = getAction(reason, true);
    dispatch(rejectedAction);
    dispatch(patchEffect(effectId));

    throw reason;
  };
  const handleFulfill = (value = null) => {
    const resolvedAction = getAction(value, false);
    dispatch(resolvedAction);
    dispatch(patchEffect(effectId));

    return { value, action: resolvedAction };
  };

  dispatch(patchEffect(effectId));
  next({
    type: `${type}_PENDING`,
    // Include payload (for optimistic updates) if it is defined.
    ...(data !== undefined ? { payload: data } : {}),
    // Include meta data if it is defined.
    ...(meta !== undefined ? { meta } : {})
  });

  return promise.then(handleFulfill, handleReject);
};
