import { REDUX_LOADING_MIDDLEWARE } from '../helpers/const';

export function reduxLoadingSelector<TStore>(
  store: TStore & {
    [REDUX_LOADING_MIDDLEWARE]: RLM.State;
  }
): boolean {
  return store[REDUX_LOADING_MIDDLEWARE].isLoading;
}
