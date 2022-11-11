import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import config from 'config'

const headers = {
  'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json'
}

const applySmartPrice = async (productId: string, cartId: string): Promise<Task> => {
  const url: string = processLocalizedURLAddress(config.smartPrice.endpoint.apply)
    .replace('{{productId}}', productId)
    .replace('{{cartId}}', cartId)

  return TaskQueue.execute({
    url: url,
    payload: {
      method: 'GET',
      mode: 'cors',
      headers
    }
  })
}

const changeSmartPriceCart = async (oldCartToken: string, newCartId: string): Promise<Task> => {
  const url: string = processLocalizedURLAddress(config.smartPrice.endpoint.change)
    .replace('{{oldCartToken}}', oldCartToken)
    .replace('{{newCartId}}', newCartId)

  return TaskQueue.execute({
    url: url,
    payload: {
      method: 'POST',
      mode: 'cors',
      headers
    }
  })
}

export const SmartPriceDataResolver = {
  applySmartPrice,
  changeSmartPriceCart
}
