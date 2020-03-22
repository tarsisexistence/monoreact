export const defineDependencyFlag = (
  saveDev?: boolean | string,
  D?: boolean | string
): CLI.Dependency.Flag => {
  switch (true) {
    case Boolean(saveDev):
      return '--dev';

    case Boolean(D):
      return '-D';

    default:
      return '' as CLI.Dependency.Flag;
  }
};
