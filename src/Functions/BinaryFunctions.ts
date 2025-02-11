import * as math from '@stdlib/math/base/special';

type ReturnT<Input1T, Input2T, BaseT> = Input1T extends Array<any> ? BaseT[] : Input2T extends Array<any> ? BaseT[] : BaseT;

function broadcast_binary<ScalarInput1T, ScalarInput2T, ScalarReturnT>(fun: (x: ScalarInput1T, y: ScalarInput2T) => ScalarReturnT) {
  return function<T1 extends ScalarInput1T | ScalarInput1T[],
                  T2 extends ScalarInput2T | ScalarInput2T[]>(x: T1, y: T2): ReturnT<T1, T2, ScalarReturnT> {
    // Need to provide type hints that the scalar type of the input arguments
    // will always match the function argument types
    type ScalarT1 = Extract<T1, ScalarInput1T>;
    type ScalarT2 = Extract<T2, ScalarInput2T>;

    if (Array.isArray(x) && Array.isArray(y)) {
      return x.map((d, idx) => fun(d, y[idx])) as ReturnT<T1, T2, ScalarReturnT>;
    } else if (Array.isArray(x) && !Array.isArray(y)) {
      return x.map(d => fun(d, y as ScalarT2)) as ReturnT<T1, T2, ScalarReturnT>;
    } else if(!Array.isArray(x) && Array.isArray(y)) {
      return y.map(d => fun(x as ScalarT1, d)) as ReturnT<T1, T2, ScalarReturnT>;
    } else {
      return fun(x as ScalarT1, y as ScalarT2) as ReturnT<T1, T2, ScalarReturnT>;
    }
  };
}

// Need to have special handling for negative x, as pow will return NaN for
// negative inputs with fractional exponents
const pow = broadcast_binary((x: number, y: number): number => (x >= 0.0) ? math.pow(x, y) : -math.pow(-x, y));
const add = broadcast_binary((x: number, y: number): number => x + y);
const subtract = broadcast_binary((x: number, y: number): number => x - y);
const divide = broadcast_binary((x: number, y: number): number => x / y);
const multiply = broadcast_binary((x: number, y: number): number => x * y);

export {
  pow,
  subtract,
  add,
  divide,
  multiply
};

export default broadcast_binary;
