
<!-- frontend/src/pages/dashboard.vue -->

<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">Dashboard Cryptocurrency</h1>

    <!-- Message / Toast -->
    <transition name="fade">
      <div v-if="message.text" :class="['msg-box', message.type]">
        {{ message.text }}
      </div>
    </transition>

    <!-- Ranking Table Card -->
    <div class="card">
      <h2 class="card-title">Ranking Cryptocurrency</h2>

      <RankingTable
        :data="cryptoData"
        :loading="loading"
        :per-page="perPage"
        :selected-crypto="selectedCrypto"
        @select-crypto="handleSelectCrypto"
        @load-more="handleLoadMore"
      />
    </div>

    <!-- Chart Card -->
    <div class="card">
      <h2 class="card-title">
        {{ selectedCrypto ? `${selectedCrypto.name} Price Chart` : 'Price Chart' }}
      </h2>

      <!-- Period Buttons -->
      <div class="period-buttons">
        <button
          v-for="period in periods"
          :key="period.value"
          :class="['period-btn', { active: selectedDays === period.value }]"
          @click="handleDaysChange(period.value)"
        >
          {{ period.label }}
        </button>
      </div>

      <!-- Chart -->
      <PriceChart
        :chart-data="chartData"
        :loading="chartLoading"
        :selected-crypto="selectedCrypto"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import RankingTable from '~/components/RankingTable.vue'
import PriceChart from '~/components/PriceChart.vue'

definePageMeta({ layout: 'default' })

// Inject plugin API
const { $getMarketRank, $getPrices } = useNuxtApp()

// State
const cryptoData = ref([])
const perPage = ref(10)
const loading = ref(true)
const selectedCrypto = ref(null)
const chartData = ref([])
const selectedDays = ref(7)
const chartLoading = ref(false)

// UI Message (toast)
const message = ref({ text: '', type: '' })
const showMessage = (text, type = 'info') => {
  message.value = { text, type }
  setTimeout(() => (message.value.text = ''), 2500)
}

// Period options
const periods = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
  { label: '365d', value: 365 }
]

/* --------------------------------------------------------------------------
  API + MOCK FALLBACK OPTIMAL 
   - mock NO DUPLICATE
   - mock only if API fails
   - mock always matches API structure
-------------------------------------------------------------------------- */

// CLEAN MOCK (NO DUPLICATE)
const baseCryptos = [
  { name: 'Bitcoin', symbol: 'BTC', id: 'bitcoin' },
  { name: 'Ethereum', symbol: 'ETH', id: 'ethereum' },
  { name: 'Tether', symbol: 'USDT', id: 'tether' },
  { name: 'Ripple', symbol: 'XRP', id: 'ripple' },
  { name: 'Cardano', symbol: 'ADA', id: 'cardano' },
  { name: 'Solana', symbol: 'SOL', id: 'solana' },
  { name: 'Polkadot', symbol: 'DOT', id: 'polkadot' },
  { name: 'Dogecoin', symbol: 'DOGE', id: 'dogecoin' },
  { name: 'BNB', symbol: 'BNB', id: 'binancecoin' },
  { name: 'Avalanche', symbol: 'AVAX', id: 'avalanche' }
]

// ✔ mock ranking
const generateMockCryptoData = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const c = baseCryptos[i % baseCryptos.length]
    const basePrice = 30000 + Math.random() * 20000

    return {
      id: c.id + '-' + i,
      cryptoId: c.id,
      rank: i + 1,
      name: c.name,
      symbol: c.symbol,
      price: basePrice,
      change24h: (Math.random() * 10 - 5).toFixed(2),
      marketCap: Math.floor(basePrice * 1000000 * Math.random())
    }
  })
}

// ✔ mock chart
const generateMockChartData = (days) => {
  const now = Date.now()
  const basePrice = 40000 + Math.random() * 15000

  return Array.from({ length: days }, (_, i) => {
    const timestamp = now - (i * 86400000)
    const variation = (Math.random() - 0.5) * 2000

    return {
      timestamp,
      price: basePrice + variation,
      date: new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
  }).reverse()
}

/* --------------------------------------------------------------------------
   🔥 FETCH FUNCTIONS (with optimal fallback)
-------------------------------------------------------------------------- */

const fetchMarketRank = async () => {
  loading.value = true
  try {
    const res = await $getMarketRank(perPage.value, 1)

    if (!res?.data || !Array.isArray(res.data)) {
      throw new Error("Invalid response format")
    }

    cryptoData.value = res.data
  } catch (e) {
    console.warn("⚠ API ranking failed → using mock")
    cryptoData.value = generateMockCryptoData(perPage.value)
    showMessage("Using mock ranking data (API offline)", "warning")
  } finally {
    loading.value = false
  }
}

const fetchChartData = async (cryptoId) => {
  if (!cryptoId) return
  chartLoading.value = true

  try {
    const res = await $getPrices(cryptoId, selectedDays.value)

    if (!res?.data) throw new Error("Invalid chart response")

    chartData.value = res.data
  } catch (e) {
    console.warn("⚠ API chart failed → mock used")
    chartData.value = generateMockChartData(selectedDays.value)
    showMessage("Mock chart data used (API offline)", "warning")
  } finally {
    chartLoading.value = false
  }
}

/* --------------------------------------------------------------------------
   🔥 Events
-------------------------------------------------------------------------- */

const handleSelectCrypto = (crypto) => {
  selectedCrypto.value = crypto
  fetchChartData(crypto.cryptoId)
}

const handleLoadMore = () => {
  if (perPage.value < 50) {
    perPage.value += 10
    fetchMarketRank()
  }
}

const handleDaysChange = (days) => {
  selectedDays.value = days
  if (selectedCrypto.value) {
    fetchChartData(selectedCrypto.value.cryptoId)
  }
}

/* --------------------------------------------------------------------------
   🔥 Lifecycle
-------------------------------------------------------------------------- */
watch(perPage, fetchMarketRank)

onMounted(fetchMarketRank)
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--cyan-primary);
}

.card {
  background: var(--dark-tertiary);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #30363d;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--white);
}

.period-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.period-btn {
  padding: 10px 20px;
  background: #1c2128;
  color: var(--gray-light);
  border: 1px solid #30363d;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.period-btn:hover {
  background: #252c36;
}

.period-btn.active {
  background: var(--cyan-primary);
  color: var(--dark-primary);
  border: none;
}


.msg-box {
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 12px;
  font-weight: 600;
  animation: fadeInOut 2.5s;
}

.msg-box.info {
  background: #e3f2fd;
  color: #0d47a1;
}

.msg-box.success {
  background: #e8f5e9;
  color: #1b5e20;
}

.msg-box.warning {
  background: #fff8e1;
  color: #ff6f00;
}

.msg-box.error {
  background: #ffebee;
  color: #c62828;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .dashboard-title {
    font-size: 24px;
  }

  .card {
    padding: 16px;
  }
}
</style>