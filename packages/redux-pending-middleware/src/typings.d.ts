declare namespace RPM {
  type EffectHandler = 'thunk' | 'toolkit';
  // | 'saga'

  type Config = Record<EffectHandler, boolean>;

  interface State {
    isPending: boolean;
  }
}
