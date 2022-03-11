import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useStoredState<T>(name: string): [T | undefined, Dispatch<SetStateAction<T | undefined>>];
export function useStoredState<T>(name: string, defaultValue: T | (() => T)): [T, Dispatch<SetStateAction<T>>];
export function useStoredState<T>(name: string, defaultValue?: T | (() => T)) {
  const [state, setState] = useState(() => {
    const savedState = localStorage.getItem(name);
    return savedState !== null
      ? (JSON.parse(savedState) as T)
      : defaultValue instanceof Function
      ? defaultValue()
      : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(name, JSON.stringify(state));
  }, [state, name]);

  return [state, setState];
}
