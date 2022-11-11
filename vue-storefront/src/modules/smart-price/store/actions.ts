import { SmartPriceDataResolver } from '../data-resolver/smart-price-service'
import { ActionTree } from 'vuex'
import { SmartPriceState } from '../types'
import RootState from 'core/types/RootState'
import * as types from './mutation-types'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'

const actions: ActionTree<SmartPriceState, RootState> = {
  async loadProductSmartPrice ({ commit, dispatch, rootState }, { productId }) {
    if (!rootState.cart.cartServerToken) {
      await dispatch('cart/connect', { guestCart: false, forceClientState: false }, { root: true })
    }

    const resp = await SmartPriceDataResolver.applySmartPrice(productId, rootState.cart.cartServerToken)

    if (resp.code === 200) {
      try {
        commit(types.ADD_SMART_PRICE, {
          productId,
          smartPrice: resp.result
        })

        dispatch('saveSmartPrices')

        return resp.result
      } catch (e) {}
    }

    return null
  },
  async restoreSavedSmartPrices ({ commit }) {
    const data = await StorageManager.get('smart-price').getItem('smart-prices')
    commit(types.SET_SMART_PRICES, data || [])
  },
  saveSmartPrices ({ getters }) {
    StorageManager.get('smart-price').setItem('smart-prices', getters.getSmartPrices)
  }
}

export default actions
