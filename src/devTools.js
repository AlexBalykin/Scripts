const getNum = (...num) => {
  const result = num.map((n) => `31064700${n.trim()}`);
  console.log(result.join('\n'));
};
getNum('00989689 ', '0098968922');
