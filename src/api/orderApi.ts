/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from './AxiosClient';
import {
  OrderModel,
  OrderCreateRequest,
  OrderUpdateRequest,
} from '../types/order';
import socket from './socketInit'; //  THÊM DÒNG NÀY

const URL = '/order';

const orderApi = {
  //  Lấy danh sách tất cả đơn hàng
  getAll() {
    return axiosClient
      .get<{ success: boolean; data: OrderModel[] }>(`${URL}`)
      .then(res => res.data.data);
  },

  //  Tìm kiếm/lọc đơn hàng
  search(params: any) {
    return axiosClient
      .get<{ success: boolean; data: OrderModel[] }>(`${URL}/search`, { params })
      .then(res => res.data.data);
  },

  //  Tạo đơn hàng
  create(data: OrderCreateRequest) {
    return axiosClient
      .post<{ success: boolean; data: OrderModel }>(`${URL}`, data, {
        headers: {
          'x-socket-id': socket.id || '', // 👈 GỬI socket.id
        },
      })
      .then(res => res.data.data);
  },

  //  Lấy đơn hàng theo ID
  getById(orderId: number) {
    return axiosClient
      .get<{ success: boolean; data: OrderModel }>(`${URL}/${orderId}`)
      .then(res => res.data.data);
  },

  //  Cập nhật đơn hàng
  update(orderId: number, data: OrderUpdateRequest) {
    return axiosClient
      .patch<{ success: boolean; data: OrderModel }>(`${URL}/${orderId}`, data, {
        headers: {
          'x-socket-id': socket.id || '', // 👈 GỬI socket.id
        },
      })
      .then(res => res.data.data);
  },

  //  Tính lại tổng tiền đơn hàng
  recalculateTotal(orderId: number) {
    return axiosClient
      .patch<{ success: boolean; total: number }>(`${URL}/${orderId}/recalculate`)
      .then(res => res.data.total);
  },

  //  Xoá đơn hàng
  delete(orderId: number) {
    return axiosClient
      .delete<{ success: boolean; message: string }>(`${URL}/${orderId}`, {
        headers: {
          'x-socket-id': socket.id || '', // 👈 GỬI socket.id
        },
      })
      .then(res => res.data);
  },
  getByCustomerId(customerId: number) {
  return axiosClient
    .get<{ success: boolean; data: OrderModel[] }>(`${URL}/customer/${customerId}`)
    .then(res => res.data.data);
},
};

export default orderApi;
