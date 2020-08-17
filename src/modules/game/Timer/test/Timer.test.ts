import 'jest-webgl-canvas-mock';
import Timer from '../Timer';

let timer: Timer;

const dummyCallback = () => {};

beforeEach(() => {
  timer = new Timer();
});

test('Timer - setCallback()', () => {
  timer.setCallback(dummyCallback);
  expect(timer.getCallback()).toEqual(dummyCallback);
});

test('Timer - getIsRunning()', () => {
  expect(timer.getIsRunning()).toBeFalsy();
});

test('Timer - getContainer()', () => {
  expect(timer.getContainer().children).toHaveLength(0);
});

test('Timer - startTimer()', () => {
  timer.startTimer(new Date().getTime(), 1000);
  expect(timer.getIsRunning()).toBeTruthy();
});

test('Timer - render()', () => {
  timer.startTimer(new Date().getTime(), 1000);
  timer.update();
  expect(timer.getContainer().children).toHaveLength(1);
  timer.removeAllAssets();
  expect(timer.getContainer().children).toHaveLength(0);
});
