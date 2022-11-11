import { GetterTree } from 'vuex'
import { SmartPriceState } from '../types'
import RootState from 'core/types/RootState'

const getters: GetterTree<SmartPriceState, RootState> = {
  getSmartPrices: state => state.smartPrices
}

export default getters
