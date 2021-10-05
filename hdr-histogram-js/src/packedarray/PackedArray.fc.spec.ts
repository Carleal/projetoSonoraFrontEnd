/*
 * This is a TypeScript port of the original Java version, which was written by
 * Gil Tene as described in
 * https://github.com/HdrHistogram/HdrHistogram
 * and released to the public domain, as explained at
 * http://creativecommons.org/publicdomain/zero/1.0/
 */
import * as fc from "fast-check";
import { PackedArray } from "./PackedArray";

const runFromStryker = __dirname.includes("stryker");

const runnerOptions = {
  numRuns: runFromStryker ? 10 : 1000,
  verbose: true
};

describe("Packed array", () => {
  it("should store data as a regular sparse array", () => {
    const SIZE = 1000;
    fc.assert(
      fc.property(arbData(SIZE), entries => {
        const packedArray = new PackedArray(SIZE + 1);
        const sparseArray = new Array();
        entries.forEach(([index, value]) => packedArray.add(index, value));
        entries.forEach(([index, value]) => {
          if (sparseArray[index]) {
            sparseArray[index] = sparseArray[index] + value;
          } else {
            sparseArray[index] = value;
          }
        });
        return entries.every(
          ([index]) => sparseArray[index] === packedArray.get(index)
        );
      }),
      runnerOptions
    );
  });
});

const arbData = (size: number) =>
  fc.array(fc.tuple(fc.integer(1, size), fc.integer(1, 100000000)), 1, size);
