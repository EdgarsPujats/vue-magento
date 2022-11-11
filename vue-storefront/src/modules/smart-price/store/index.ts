import { SmartPriceState } from '../types'
import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export const smartPriceStore: Module<SmartPriceState, RootState> = {
  namespaced: true,
  state: {
    smartPrices: []
  },
  getters,
  actions,
  mutations
}
