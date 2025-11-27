import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const getMarketRank = (perPage = 20, page = 1) =>
    api.get('/market-rank', {
      params: { per_page: perPage, page }
    });

  const getPrices = (cryptoId, days = 30, interval = 'daily') =>
    api.get(`/prices-chart/${cryptoId}`, {
      params: { days, interval }
    });

  return {
    provide: {
      getMarketRank: getMarketRank,
      getPrices: getPrices,
    }
  };

});
