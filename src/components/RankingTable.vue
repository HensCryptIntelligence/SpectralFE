<!-- frontend/src/components/RankingTable.vue -->
 
<template>
  <div class="ranking-table-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      Loading...
    </div>

    <!-- Table -->
    <div v-else class="table-wrapper">
      <table class="ranking-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th class="text-right">Price</th>
            <th class="text-right">24h Change</th>
            <th class="text-right">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="crypto in data"
            :key="crypto.id"
            :class="['crypto-row', { selected: selectedCrypto?.id === crypto.id }]"
            @click="$emit('select-crypto', crypto)"
          >
            <td class="rank-cell">{{ crypto.rank }}</td>
            <td class="name-cell">
              <div class="crypto-name">{{ crypto.name }}</div>
              <div class="crypto-symbol">{{ crypto.symbol }}</div>
            </td>
            <td class="price-cell text-right">{{ formatCurrency(crypto.price) }}</td>
            <td class="change-cell text-right" :class="crypto.change24h >= 0 ? 'positive' : 'negative'">
              {{ crypto.change24h >= 0 ? '+' : '' }}{{ crypto.change24h.toFixed(2) }}%
            </td>
            <td class="marketcap-cell text-right">{{ formatMarketCap(crypto.marketCap) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Show More Button -->
    <button
      v-if="perPage < 50 && !loading"
      class="show-more-btn"
      @click="$emit('load-more')"
    >
      Show More ({{ perPage }}/50)
    </button>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  perPage: {
    type: Number,
    default: 10
  },
  selectedCrypto: {
    type: Object,
    default: null
  }
})

defineEmits(['select-crypto', 'load-more'])

// Format currency to USD
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// Format market cap to USD with abbreviations
const formatMarketCap = (value) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
  return formatCurrency(value)
}
</script>

<style scoped>
.ranking-table-container {
  width: 100%;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: var(--gray-medium);
}

.table-wrapper {
  overflow-x: auto;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.ranking-table thead tr {
  border-bottom: 1px solid #30363d;
}

.ranking-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-medium);
}

.ranking-table th.text-right {
  text-align: right;
}

.crypto-row {
  border-bottom: 1px solid #30363d;
  cursor: pointer;
  transition: background 0.2s ease;
}

.crypto-row:hover {
  background: #1c2128;
}

.crypto-row.selected {
  background: #1c2128;
}

.ranking-table td {
  padding: 16px;
  font-size: 14px;
}

.rank-cell {
  color: var(--gray-light);
}

.name-cell {
  font-weight: 500;
  color: var(--white);
}

.crypto-name {
  color: var(--white);
}

.crypto-symbol {
  font-size: 12px;
  color: var(--gray-medium);
  margin-top: 2px;
}

.price-cell {
  font-weight: 500;
  color: var(--white);
}

.change-cell {
  font-weight: 600;
}

.change-cell.positive {
  color: var(--cyan-primary);
}

.change-cell.negative {
  color: var(--red-accent);
}

.marketcap-cell {
  color: var(--gray-light);
}

.text-right {
  text-align: right;
}

.show-more-btn {
  margin-top: 20px;
  padding: 12px 24px;
  background: var(--cyan-primary);
  color: var(--dark-primary);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  font-family: inherit;
}

.show-more-btn:hover {
  background: #00e690;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .ranking-table {
    font-size: 13px;
  }

  .ranking-table th,
  .ranking-table td {
    padding: 10px 12px;
  }

  .crypto-symbol {
    font-size: 11px;
  }
}
</style>