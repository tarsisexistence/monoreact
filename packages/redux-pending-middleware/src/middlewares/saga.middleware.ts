import { AnyAction } from 'redux';
import { put } from '@redux-saga/core/effects';

import { patchEffect } from '../store/actions';
import { nanoid } from '../helpers/nanoid.utils';

// not implemented
// export const pendingSagaMiddleware =  null;
export const trackWorker = (worker: (action: AnyAction) => any) =>
  function* wrapper(action: AnyAction) {
    const effectId = nanoid();

    if (!put) {
      throw new Error('trackWorker expects installed redux-saga package.');
    }

    try {
      yield put(patchEffect(effectId));
      yield* worker(action);
      yield put(patchEffect(effectId));
    } catch (e) {
      yield put(patchEffect(effectId));
    }
  };
