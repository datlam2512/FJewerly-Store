// src/store/middleware.js
import { fetchPromotions } from './promotionallSlice';

export const promotionsMiddleware = store => next => action => {
  if (action.type === 'promotions/approvePromotion/fulfilled') {
    store.dispatch(fetchPromotions());
  }
  return next(action);
};
