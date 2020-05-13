export const convertStringArrayIntoMap = (
  input: string = ''
): Map<string, true> => {
  let str = '';

  for (let i = 0; i < input.length; i += 1) {
    if (input[i] !== ' ') {
      str += input[i];
    }
  }
  return str === ''
    ? new Map()
    : new Map(str.split(',').map(name => [name, true]));
};
