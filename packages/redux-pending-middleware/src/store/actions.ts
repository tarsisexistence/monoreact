import { REDUX_PENDING_MIDDLEWARE_PATCH_EFFECT } from '../helpers/const';

export const patchEffect = (
  payload: string
): { type: string; payload: string } => ({
  type: REDUX_PENDING_MIDDLEWARE_PATCH_EFFECT,
  payload
});
