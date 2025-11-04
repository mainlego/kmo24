<template>
  <div class="simple-chart">
    <div v-if="title" class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <slot name="actions"></slot>
    </div>

    <!-- Bar Chart -->
    <div v-if="type === 'bar'" class="bar-chart">
      <div class="chart-area">
        <div class="y-axis">
          <span v-for="tick in yAxisTicks" :key="tick" class="y-tick">
            {{ formatValue(tick) }}
          </span>
        </div>
        <div class="bars-container">
          <div v-for="(item, index) in chartData" :key="index" class="bar-wrapper">
            <div
              class="bar"
              :style="{
                height: `${(item.value / maxValue) * 100}%`,
                background: getBarColor(index),
              }"
              @mouseenter="showTooltip(item, $event)"
              @mouseleave="hideTooltip"
            >
              <span class="bar-value">{{ formatValue(item.value) }}</span>
            </div>
            <span class="bar-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Line Chart -->
    <div v-else-if="type === 'line'" class="line-chart">
      <div class="chart-area">
        <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" class="line-svg">
          <!-- Grid lines -->
          <g class="grid">
            <line
              v-for="i in 5"
              :key="'h' + i"
              :x1="0"
              :y1="(svgHeight / 5) * i"
              :x2="svgWidth"
              :y2="(svgHeight / 5) * i"
              stroke="#e5e7eb"
              stroke-width="1"
            />
          </g>

          <!-- Line path -->
          <path
            :d="linePath"
            fill="none"
            :stroke="lineColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Area fill -->
          <path
            v-if="showArea"
            :d="areaPath"
            :fill="`url(#gradient-${_uid})`"
            opacity="0.3"
          />

          <!-- Gradient definition -->
          <defs>
            <linearGradient :id="`gradient-${_uid}`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" :stop-color="lineColor" stop-opacity="0.5" />
              <stop offset="100%" :stop-color="lineColor" stop-opacity="0" />
            </linearGradient>
          </defs>

          <!-- Data points -->
          <circle
            v-for="(point, index) in linePoints"
            :key="index"
            :cx="point.x"
            :cy="point.y"
            r="5"
            :fill="lineColor"
            class="data-point"
            @mouseenter="showTooltip(chartData[index], $event)"
            @mouseleave="hideTooltip"
          />
        </svg>

        <div class="x-axis">
          <span v-for="(item, index) in chartData" :key="index" class="x-label">
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- Pie/Donut Chart -->
    <div v-else-if="type === 'pie' || type === 'donut'" class="pie-chart">
      <svg :viewBox="`0 0 ${pieSize} ${pieSize}`" class="pie-svg">
        <g :transform="`translate(${pieSize / 2}, ${pieSize / 2})`">
          <!-- Segments -->
          <path
            v-for="(segment, index) in pieSegments"
            :key="index"
            :d="segment.path"
            :fill="getBarColor(index)"
            class="pie-segment"
            @mouseenter="showTooltip(chartData[index], $event)"
            @mouseleave="hideTooltip"
          />

          <!-- Center hole for donut -->
          <circle
            v-if="type === 'donut'"
            :r="pieRadius * 0.6"
            fill="white"
          />
        </g>
      </svg>

      <div class="pie-legend">
        <div v-for="(item, index) in chartData" :key="index" class="legend-item">
          <span class="legend-color" :style="{ background: getBarColor(index) }"></span>
          <span class="legend-label">{{ item.label }}</span>
          <span class="legend-value">{{ formatValue(item.value) }}</span>
          <span class="legend-percent">({{ ((item.value / totalValue) * 100).toFixed(1) }}%)</span>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <div
      v-if="tooltip.show"
      class="chart-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="tooltip-label">{{ tooltip.label }}</div>
      <div class="tooltip-value">{{ formatValue(tooltip.value) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue';

interface ChartData {
  label: string;
  value: number;
}

interface Props {
  type?: 'bar' | 'line' | 'pie' | 'donut';
  data: ChartData[];
  title?: string;
  colors?: string[];
  lineColor?: string;
  showArea?: boolean;
  valueFormatter?: (value: number) => string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'bar',
  colors: () => ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#fb923c', '#fbbf24'],
  lineColor: '#3b82f6',
  showArea: true,
});

const instance = getCurrentInstance();
const _uid = instance?.uid || Math.random();

// Chart dimensions
const svgWidth = 600;
const svgHeight = 300;
const pieSize = 300;
const pieRadius = 120;

// Tooltip
const tooltip = ref({
  show: false,
  label: '',
  value: 0,
  x: 0,
  y: 0,
});

// Computed
const chartData = computed(() => props.data);

const maxValue = computed(() => {
  return Math.max(...chartData.value.map(item => item.value));
});

const totalValue = computed(() => {
  return chartData.value.reduce((sum, item) => sum + item.value, 0);
});

const yAxisTicks = computed(() => {
  const ticks = [];
  const step = maxValue.value / 4;
  for (let i = 0; i <= 4; i++) {
    ticks.push(Math.round(maxValue.value - step * i));
  }
  return ticks;
});

// Line chart calculations
const linePoints = computed(() => {
  if (!chartData.value.length) return [];

  const points = [];
  const stepX = svgWidth / (chartData.value.length - 1 || 1);

  chartData.value.forEach((item, index) => {
    const x = index * stepX;
    const y = svgHeight - (item.value / maxValue.value) * svgHeight;
    points.push({ x, y });
  });

  return points;
});

const linePath = computed(() => {
  if (!linePoints.value.length) return '';

  let path = `M ${linePoints.value[0].x} ${linePoints.value[0].y}`;

  for (let i = 1; i < linePoints.value.length; i++) {
    const prev = linePoints.value[i - 1];
    const curr = linePoints.value[i];

    // Smooth curve
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = curr.x - (curr.x - prev.x) / 2;
    const cp2y = curr.y;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  return path;
});

const areaPath = computed(() => {
  if (!linePoints.value.length) return '';

  let path = linePath.value;
  const lastPoint = linePoints.value[linePoints.value.length - 1];
  const firstPoint = linePoints.value[0];

  path += ` L ${lastPoint.x} ${svgHeight}`;
  path += ` L ${firstPoint.x} ${svgHeight}`;
  path += ' Z';

  return path;
});

// Pie chart calculations
const pieSegments = computed(() => {
  const segments = [];
  let currentAngle = -90; // Start from top

  chartData.value.forEach(item => {
    const angle = (item.value / totalValue.value) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const path = createArc(0, 0, pieRadius, startAngle, endAngle);
    segments.push({ path });

    currentAngle = endAngle;
  });

  return segments;
});

// Methods
const getBarColor = (index: number): string => {
  return props.colors[index % props.colors.length];
};

const formatValue = (value: number): string => {
  if (props.valueFormatter) {
    return props.valueFormatter(value);
  }

  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};

const showTooltip = (item: ChartData, event: MouseEvent) => {
  tooltip.value = {
    show: true,
    label: item.label,
    value: item.value,
    x: event.clientX + 10,
    y: event.clientY + 10,
  };
};

const hideTooltip = () => {
  tooltip.value.show = false;
};

const createArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number): string => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'L', x, y,
    'Z',
  ].join(' ');
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
};
</script>

<style scoped lang="scss">
.simple-chart {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

// Bar Chart
.bar-chart {
  .chart-area {
    display: flex;
    gap: 1rem;
  }

  .y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 0.5rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .bars-container {
    flex: 1;
    display: flex;
    gap: 1rem;
    align-items: flex-end;
    min-height: 200px;
    padding: 0.5rem 0;
  }

  .bar-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .bar {
    width: 100%;
    min-height: 20px;
    border-radius: 0.375rem 0.375rem 0 0;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 0.5rem;

    &:hover {
      opacity: 0.8;
      transform: scaleY(1.05);
    }
  }

  .bar-value {
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
  }

  .bar-label {
    font-size: 0.75rem;
    color: #6b7280;
    text-align: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

// Line Chart
.line-chart {
  .chart-area {
    position: relative;
  }

  .line-svg {
    width: 100%;
    height: 250px;
    margin-bottom: 1rem;

    .data-point {
      cursor: pointer;
      transition: r 0.2s;

      &:hover {
        r: 7;
      }
    }
  }

  .x-axis {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .x-label {
    flex: 1;
    text-align: center;
  }
}

// Pie Chart
.pie-chart {
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  .pie-svg {
    width: 300px;
    height: 300px;

    .pie-segment {
      cursor: pointer;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .pie-legend {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
  }

  .legend-color {
    width: 1rem;
    height: 1rem;
    border-radius: 0.25rem;
    flex-shrink: 0;
  }

  .legend-label {
    flex: 1;
    color: #374151;
  }

  .legend-value {
    font-weight: 600;
    color: #111827;
  }

  .legend-percent {
    color: #6b7280;
    font-size: 0.75rem;
  }
}

// Tooltip
.chart-tooltip {
  position: fixed;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  pointer-events: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .tooltip-label {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .tooltip-value {
    color: #93c5fd;
  }
}
</style>
