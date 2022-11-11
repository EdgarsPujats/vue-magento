import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { mapGetters } from 'vuex'

dayjs.extend(relativeTime)

export default {
  data () {
    return {
      currentTimestamp: Math.round(+new Date() / 1000),
      timer: null,
      timeLeft: false
    }
  },
  filters: {
    timeFormat (value) {
      const minutes = Math.floor(value / 60)
      const seconds = value - minutes * 60

      return `${minutes} min ${seconds} s`
    }
  },
  watch: {
    smartPriceActive () {
      this.startCountdown()
    }
  },
  mounted () {
    this.startCountdown()
  },
  computed: {
    ...mapGetters({
      getSmartPrices: 'smart-price/getSmartPrices'
    }),
    smartPrice () {
      const data = this.getSmartPrices.find(smartPrice => parseInt(smartPrice.productId) === parseInt(this.product.id))

      if (data) {
        return data.smartPrice
      }

      return null
    },
    smartPriceActive () {
      return this.smartPrice && this.smartPrice.best_price_status === 'lower' && !this.isExpired
    },
    smartPriceAlreadyLowest () {
      return (this.smartPrice && this.smartPrice.best_price_status === 'best') && !this.isExpired
    },
    smartPriceShowLoader () {
      return this.componentLoading || this.requestingSmartPrice
    },
    smartPriceShowRequestButton () {
      return !this.smartPriceAlreadyLowest && !this.smartPriceActive && !this.isOnCooldown
    },
    isOnCooldown () {
      if (this.smartPrice) {
        return this.smartPrice.cooldown_at > this.currentTimestamp
      }

      return false
    },
    isExpired () {
      if (this.smartPrice) {
        return this.smartPrice.expires_at < this.currentTimestamp
      }

      return true
    }
  },
  methods: {
    startCountdown () {
      this.updateTimeLeft()

      if (this.smartPriceActive || this.isOnCooldown) {
        this.timer = setInterval(() => {
          this.updateTimeLeft()

          if (!this.smartPriceActive && !this.isOnCooldown) {
            clearInterval(this.timer)
          }
        }, 1000)
      }
    },
    updateTimeLeft () {
      this.currentTimestamp = Math.round(+new Date() / 1000)

      if (this.smartPrice && this.smartPrice.expires_at > this.currentTimestamp) {
        this.timeLeft = dayjs(this.smartPrice.expires_at).diff(this.currentTimestamp)
        return
      } else if (this.smartPrice && this.smartPrice.cooldown_at > this.currentTimestamp) {
        this.timeLeft = dayjs(this.smartPrice.cooldown_at).diff(this.currentTimestamp)
        return
      }

      this.timeLeft = false
    }
  }
}
