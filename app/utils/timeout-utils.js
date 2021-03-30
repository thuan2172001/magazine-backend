function delay(after) {
  return new Promise((resolve) => {
    setTimeout(resolve, after);
  });
}
async function interval(func, delayTime) {
  await func();
  await delay(delayTime);
  await interval(func, delayTime);
}

module.exports = {
  delay,
  interval,
};
