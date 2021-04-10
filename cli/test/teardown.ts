import { deleteNpmAuthorName } from '../src/shared/utils';

module.exports = async () => {
  // @ts-ignore
  const hasAuthorToken = global.HAS_AUTHOR_TOKEN;

  if (!hasAuthorToken) {
    deleteNpmAuthorName('test');
  }
};
