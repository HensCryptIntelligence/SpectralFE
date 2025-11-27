
<!-- frontend/src/pages/dashboard.vue -->
 
<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">Dashboard Cryptocurrency</h1>

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

      <!-- Chart Component -->
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

definePageMeta({
  layout: 'default'
})

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

// Period options
const periods = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
  { label: '365d', value: 365 }
]

// Fetch market rank data
const fetchMarketRank = async () => {
  loading.value = true
  try {
    const response = await $getMarketRank(perPage.value, 1)
    cryptoData.value = response.data || response
  } catch (error) {
    console.error('Error fetching market rank:', error)
    cryptoData.value = generateMockCryptoData(perPage.value)
  } finally {
    loading.value = false
  }
}

// Fetch chart data
const fetchChartData = async (cryptoId) => {
  if (!cryptoId) return
  
  chartLoading.value = true
  try {
    const response = await $getPrices(cryptoId, selectedDays.value)
    chartData.value = response.data || response
  } catch (error) {
    console.error('Error fetching chart data:', error)
    chartData.value = generateMockChartData(selectedDays.value, cryptoId)
  } finally {
    chartLoading.value = false
  }
}


// Mock data generators (for demo/fallback)
const generateMockCryptoData = (count) => {
  const cryptos = [
    { name: 'Bitcoin', symbol: 'BTC', id: 'bitcoin' },
    { name: 'Ethereum', symbol: 'ETH', id: 'ethereum' },
    { name: 'Tether', symbol: 'USDT', id: 'tether' },
    { name: 'Ripple', symbol: 'XRP', id: 'ripple' },
    { name: 'Cardano', symbol: 'ADA', id: 'cardano' },
    { name: 'Solana', symbol: 'SOL', id: 'solana' },
    { name: 'Polkadot', symbol: 'DOT', id: 'polkadot' },
    { name: 'Dogecoin', symbol: 'DOGE', id: 'dogecoin' },
    { name: 'Binance Coin', symbol: 'BNB', id: 'binancecoin' },
    { name: 'Avalanche', symbol: 'AVAX', id: 'avalanche' },
  ]

  return Array.from({ length: Math.min(count, 50) }, (_, i) => {
    const crypto = cryptos[i % cryptos.length]
    const basePrice = (50 - i) * 1000
    const change = (Math.random() - 0.5) * 20
    
    return {
      id: `${crypto.id}-${i}`,
      cryptoId: crypto.id,
      rank: i + 1,
      name: i >= 10 ? `${crypto.name} ${Math.floor(i / 10)}` : crypto.name,
      symbol: crypto.symbol,
      price: basePrice + (Math.random() * 500),
      change24h: change,
      marketCap: basePrice * (Math.random() * 1000000 + 500000)
    }
  })
}

const generateMockChartData = (days, cryptoId) => {
  const data = []
  const now = Date.now()
  const dayInMs = 24 * 60 * 60 * 1000
  const basePrice = 50000 + Math.random() * 20000

  for (let i = days; i >= 0; i--) {
    const date = new Date(now - (i * dayInMs))
    const variation = (Math.random() - 0.5) * basePrice * 0.1
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: basePrice + variation,
      timestamp: date.getTime()
    })
  }
  return data
}

// Event handlers
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

// Watchers
watch(perPage, () => {
  fetchMarketRank()
})

// Lifecycle
onMounted(() => {
  fetchMarketRank()
})
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