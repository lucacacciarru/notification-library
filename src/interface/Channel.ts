import { Config } from './ConfigUrl';

export interface Channel {
  [key: string]: Config;
}

// type Test = { [key: string]: number };
// let tests: Test = {};

// const addTest = (testKey: string, total: number) =>
//   (tests = { ...tests, [testKey]: total });

// const findTest = (testKey: keyof Test) => tests[testKey];
