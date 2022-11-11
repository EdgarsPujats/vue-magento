import { StorefrontModule } from 'core/lib/modules'
import { smartPriceStore } from './store'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { afterRegistration } from './hooks/afterRegistration'

export const KEY = 'smart-price'
export const SmartPriceModule: StorefrontModule = function ({ store }) {
  StorageManager.init('smart-price')
  store.registerModule(KEY, smartPriceStore)
  afterRegistration(store)
}
