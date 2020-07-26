import { getNpmAuthorName, setNpmAuthorName } from '../src/shared/utils';

module.exports = async () => {
  const author = getNpmAuthorName();
  const hasAuthorToken = author !== null;

  if (!hasAuthorToken) {
    setNpmAuthorName('test');
  }
  // @ts-ignore
  global.HAS_AUTHOR_TOKEN = hasAuthorToken;
};
