import React from 'react';
import { clamp } from 'remeda';

const isFunction = <T extends CallableFunction = CallableFunction>(
  value: unknown
): value is T => typeof value === 'function';

export const runIfFunction = <T, U>(
  valueOrFn: T | ((...fnArgs: U[]) => T),
  ...args: U[]
) => {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
};

export const getValidChildren = (children: React.ReactNode) => {
  return React.Children.toArray(children).filter((child) =>
    React.isValidElement(child)
  ) as React.ReactElement[];
};

export const getTime = (time: number) => {
  const formattedTime = Math.max(0, time);

  const hours = Math.floor(formattedTime / 3600);
  const minutes = Math.floor((formattedTime % 3600) / 60);
  const seconds = Math.floor(formattedTime % 60);

  const epochParts = [];
  if (hours > 0) epochParts.push(`H${hours}`);
  if (minutes > 0) epochParts.push(`M${minutes}`);
  if (seconds > 0 || epochParts.length === 0) epochParts.push(`S${seconds}`);

  return {
    epoch: `PT${epochParts.join('')}`,
    string: [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ]
      .filter((unit) => unit !== null)
      .join(':'),
  };
};

export const scaleValue = (
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number
) => {
  return function mapLinearly(input: number) {
    const newInput = clamp(input, { min: inputMin, max: inputMax });

    const distance = outputMax - outputMin;
    const pct = (newInput - inputMin) / (inputMax - inputMin);

    return outputMin + distance * pct;
  };
};
