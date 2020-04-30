import { Action, AnyAction, Reducer, ReducersMapObject } from 'redux';

import {
  REDUX_PENDING_MIDDLEWARE,
  REDUX_PENDING_MIDDLEWARE_FINISH_REQUEST,
  REDUX_PENDING_MIDDLEWARE_START_REQUEST
} from '../helpers/const';

const pendingReducer: Reducer<RPM.State> = (
  state: RPM.State = { isPending: false },
  action: Action<
    | typeof REDUX_PENDING_MIDDLEWARE_START_REQUEST
    | typeof REDUX_PENDING_MIDDLEWARE_FINISH_REQUEST
  >
): RPM.State => {
  switch (action.type) {
    case REDUX_PENDING_MIDDLEWARE_START_REQUEST:
      return { ...state, isPending: true };

    case REDUX_PENDING_MIDDLEWARE_FINISH_REQUEST:
      return { ...state, isPending: false };

    default:
      return state;
  }
};

export function insertPending<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
): ReducersMapObject<S, A> {
  (reducers as any)[REDUX_PENDING_MIDDLEWARE] = pendingReducer;
  return reducers;
}
