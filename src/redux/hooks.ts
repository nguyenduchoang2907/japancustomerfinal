import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Dùng khi muốn dispatch action
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Dùng khi muốn lấy state từ store
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
