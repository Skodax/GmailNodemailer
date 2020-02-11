let a = 1;
module.exports = {
  getA: () => a,
  setA: b => {
    a = b;
  }
};
