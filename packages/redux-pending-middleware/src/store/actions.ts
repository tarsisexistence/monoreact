import { REDUX_PENDING_MIDDLEWARE_PATCH_EFFECT } from '../helpers/const';

export const patchEffect = (
  payload: string | Symbol
): { type: string; payload: string | Symbol } => ({
  type: REDUX_PENDING_MIDDLEWARE_PATCH_EFFECT,
  payload,
});
