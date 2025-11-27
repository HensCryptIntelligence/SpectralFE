// file : frontend/src/plugins/api.js

import axios from 'axios';

export default defineNuxtPlugin(() => {
  // Base URL backend Flask
  const api = axios.create({
    baseURL: 'http://localhost:5000/api', 
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // API: Market Rank
  const getMarketRank = (perPage = 20, page = 1) => {
    return api.get('/market-rank', {
      params: { per_page: perPage, page }
    });
  };

  // API: Price Chart (now dynamic crypto ID)
  const getPrices = (cryptoId, days = 30, interval = 'daily') => {
    return api.get(`/prices-chart/${cryptoId}`, {
      params: { days, interval }
    });
  };

  return {
    provide: {
      api,
      getMarketRank,
      getPrices,
    }
  };
});
