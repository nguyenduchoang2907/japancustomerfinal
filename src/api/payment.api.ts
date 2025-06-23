import axiosClient from './AxiosClient';

const URL = '/payment';

const paymentApi = {

  createVNPayUrl(orderId: number, amount?: number) {
    return axiosClient.get<{ paymentUrl: string }>(`${URL}/create-url/${orderId}`, {
      params: amount ? { amount } : undefined,
    });
  },

//bug quá
  handleVNPayIPN(vnpParams: Record<string, string>) {
    return axiosClient.get<{ RspCode: string; Message: string }>(`${URL}/vnpay/ipn`, {
      params: vnpParams,
    });
  },
};

export default paymentApi;
