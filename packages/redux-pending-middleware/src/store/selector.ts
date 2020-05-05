import { REDUX_PENDING_MIDDLEWARE } from '../helpers/const';

export const selectIsPending = <TState>(state: TState): boolean => {
  const pendingState = (state as any)[REDUX_PENDING_MIDDLEWARE] as RPM.State;
  const { effectsEntity } = pendingState;
  const { length: size } = Object.keys(effectsEntity);
  return size > 0;
};
