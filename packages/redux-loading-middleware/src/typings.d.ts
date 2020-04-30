declare namespace RLM {
  type EffectHandler = 'thunk' | 'toolkit';
  // | 'saga'

  type Config = Record<EffectHandler, boolean>;

  interface State {
    isLoading: boolean;
  }
}
