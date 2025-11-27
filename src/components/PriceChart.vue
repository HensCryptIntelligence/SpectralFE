<!-- frontend/src/components/PriceChart.vue -->
 
<template>
  <div class="chart-container">

    <!-- Empty State -->
    <div v-if="!selectedCrypto" class="empty-state">
      <div class="empty-icon"></div>
      <p>Select a cryptocurrency from the table to view its price chart</p>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="loading-state">
      Loading chart...
    </div>

    <!-- Chart Canvas -->
    <div v-else class="chart-wrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  chartData: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedCrypto: {
    type: Object,
    default: null
  }
})

const chartCanvas = ref(null)
let chartInstance = null

// Format currency to USD
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// Format Y-axis labels
const formatYAxis = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}

// Create or update chart
const updateChart = () => {
  if (!chartCanvas.value || !props.chartData.length) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.chartData.map(d => d.date),
      datasets: [{
        label: 'Price',
        data: props.chartData.map(d => d.price),
        borderColor: '#00FFA0',
        backgroundColor: 'rgba(0, 255, 160, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#00FFA0',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1c2128',
          titleColor: '#8B949E',
          bodyColor: '#FFFFFF',
          borderColor: '#30363d',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return 'Price: ' + formatCurrency(context.parsed.y)
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: '#30363d',
            drawBorder: false
          },
          ticks: {
            color: '#8B949E',
            font: {
              size: 12
            },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8
          }
        },
        y: {
          grid: {
            color: '#30363d',
            drawBorder: false
          },
          ticks: {
            color: '#8B949E',
            font: {
              size: 12
            },
            callback: function(value) {
              return formatYAxis(value)
            }
          }
        }
      }
    }
  })
}

// Watch for data changes
watch(() => props.chartData, () => {
  nextTick(() => {
    updateChart()
  })
}, { deep: true })

// Cleanup on unmount
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  position: relative;
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--gray-medium);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
  text-align: center;
  max-width: 300px;
}

.loading-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-medium);
  font-size: 16px;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-wrapper canvas {
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }

  .empty-icon {
    font-size: 36px;
  }

  .empty-state p {
    font-size: 14px;
  }
}
</style>