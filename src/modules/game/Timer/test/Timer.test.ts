import 'jest-webgl-canvas-mock';
import Timer from '../Timer';

let timer: Timer;

const dummyCallback = () => {};

beforeEach(() => {
  timer = new Timer();
});

test('Timer - setCallback()', () => {
  timer.setCallback(dummyCallback);
  expect(timer.getCallback()).toStrictEqual(dummyCallback);
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

test('Timer - update()', () => {
  timer.startTimer(new Date().getTime(), 1000);
  timer.update();
  expect(timer.getContainer().children).toHaveLength(1);
  timer.removeAllAssets();
  expect(timer.getContainer().children).toHaveLength(0);
});

test('Timer - update() timeout', async () => {
  timer.startTimer(new Date().getTime(), 100);
  timer.update();
  await new Promise((resolve) => setTimeout(resolve, 200));
  timer.update();
  expect(timer.getIsRunning()).toBeFalsy();
});

test('Timer - update() does not update', async () => {
  timer.startTimer(new Date().getTime(), 100);
  timer.stopTimer();
  timer.update();
  expect(timer.getIsRunning()).toBeFalsy();
});
