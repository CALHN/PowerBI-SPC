import * as d3 from "d3";
import rep from "../Functions/rep";
import diff from "../Functions/diff";
import { abs, sqrt } from "../Functions/UnaryFunctions";
import { subtract, add, divide, multiply } from "../Functions/BinaryFunctions";
import controlLimits from "../Classes/controlLimits";
import dataObject from "../Classes/dataObject";
import truncate from "../Functions/truncate";

function uprimeLimits(inputData: dataObject): controlLimits {
  let val: number[] = divide(inputData.numerators, inputData.denominators);
  let cl: number = d3.sum(inputData.numerators) / d3.sum(inputData.denominators);
  let sd: number[] = sqrt(divide(cl,inputData.denominators));
  let zscore: number[] = divide(subtract(val,cl), sd);

  let consec_diff: number[] = abs(diff(zscore));
  let consec_diff_ulim: number = d3.mean(consec_diff) * 3.267;
  let consec_diff_valid: number[] = consec_diff.filter(d => d < consec_diff_ulim);
  let sigma: number[] = multiply(sd, d3.mean(consec_diff_valid) / 1.128);

  return new controlLimits({
    keys: inputData.keys,
    values: val,
    numerators: inputData.numerators,
    denominators: inputData.denominators,
    targets: rep(cl, inputData.keys.length),
    ll99: truncate(subtract(cl, multiply(3,sigma)), {lower: 0}),
    ll95: truncate(subtract(cl, multiply(2,sigma)), {lower: 0}),
    ul95: add(cl, multiply(2,sigma)),
    ul99: add(cl, multiply(3,sigma))
  });
}

export default uprimeLimits;
