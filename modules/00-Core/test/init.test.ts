import {initiated} from '../src/API/index';

describe('testing initiation of project', (): void => {
  test('const', (): void => {
    const resp: boolean = initiated;
    expect(resp).toBe(true);
  });

});