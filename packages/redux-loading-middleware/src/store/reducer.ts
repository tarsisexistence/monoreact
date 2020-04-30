import { Action, AnyAction, Reducer, ReducersMapObject } from 'redux';

import {
  REDUX_LOADING_MIDDLEWARE,
  REDUX_LOADING_MIDDLEWARE_FINISH_LOADING,
  REDUX_LOADING_MIDDLEWARE_START_LOADING
} from '../helpers/const';

const reduxLoadingReducer: Reducer<RLM.State> = (
  state: RLM.State = { isLoading: false },
  action
): RLM.State => {
  switch (action.type) {
    case REDUX_LOADING_MIDDLEWARE_START_LOADING:
      return { ...state, isLoading: true };

    case REDUX_LOADING_MIDDLEWARE_FINISH_LOADING:
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export function insertReduxLoadingReducer<S, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
): ReducersMapObject<S, A> {
  (reducers as any)[REDUX_LOADING_MIDDLEWARE] = reduxLoadingReducer;
  return reducers;
}
