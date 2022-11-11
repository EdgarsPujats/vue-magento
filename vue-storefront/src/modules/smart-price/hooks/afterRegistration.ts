import { Store } from 'vuex'
import { isServer } from '@vue-storefront/core/helpers'
import { USER_TOKEN_INVALIDATE_LOCK_CHANGED } from '@vue-storefront/core/store/mutation-types';
import { CART_LOAD_CART_SERVER_TOKEN } from '@vue-storefront/core/modules/cart/store/mutation-types'
import { SmartPriceDataResolver } from '../data-resolver/smart-price-service';

export const afterRegistration = (store: Store<any>) => {
  if (!isServer) {
    let oldToken = '';
    let newCartId = '';

    // Subscribe to user mutations, to update smartprice cart id
    store.subscribe(async ({ type, payload }, state) => {
      if (type.endsWith(CART_LOAD_CART_SERVER_TOKEN)) {
        newCartId = payload
        if (oldToken && newCartId) {
          await SmartPriceDataResolver.changeSmartPriceCart(oldToken, newCartId)
        }
      }
      if (type.endsWith(USER_TOKEN_INVALIDATE_LOCK_CHANGED)) {
        oldToken = state.cart.cartServerToken
      }
    })
  }
}
