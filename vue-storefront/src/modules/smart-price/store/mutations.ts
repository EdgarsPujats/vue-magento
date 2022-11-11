import { MutationTree } from 'vuex';
import { SmartPrice, SmartPriceState } from '../types'
import * as types from './mutation-types'

const mutations: MutationTree<SmartPriceState> = {
  [types.SET_SMART_PRICES] (state, smartPrices) {
    state.smartPrices = smartPrices
  },
  [types.ADD_SMART_PRICE] (state, smartPrice: SmartPrice) {
    // eslint-disable-next-line eqeqeq
    const smartPrices = state.smartPrices.filter(sp => sp.productId != smartPrice.productId)
    state.smartPrices = [...smartPrices, smartPrice]
  }
}

export default mutations
