/**
 * @file hooks.ts
 * @desc Pre-typed versions of the standard Redux hooks. 
 * Use these throughout your app instead of plain `useDispatch` and `useSelector`.
 */
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;