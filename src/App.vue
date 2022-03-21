<script setup lang="ts">
import './assets/china'
import { useStore } from './stores'
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { geoCoordMap } from './assets/geoMap'


const store = useStore()
const loading = ref(false)
const dialogTableVisible = ref(false)
const gridData = ref(store.item)

onMounted(async () => {
  loading.value = true
  await store.getList()
  initCharts()
  initPie()
  initLine()
  loading.value = false
})

const initCharts = () => {
  const city = store.data.diseaseh5Shelf.areaTree[0].children;
  store.item = city[1].children
  const data = city.map(v => {
    return {
      name: v.name,
      value: geoCoordMap[v.name].concat(v.total.nowConfirm),
      children: v.children
    }
  })
  const charts = echarts.init(document.querySelector('#china') as HTMLElement)
  charts.setOption({
    geo: {
      map: "china",
      aspectScale: 0.8,
      layoutCenter: ["50%", "50%"],
      layoutSize: "100%",
      itemStyle: {
        areaColor: {
          type: "linear-gradient",
          x: 0,
          y: 1200,
          x2: 1000,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "#152E6E", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#0673AD", // 50% 处的颜色
            },
          ],
          global: true, // 缺省为 false
        },
        shadowColor: "#0f5d9d",
        shadowOffsetX: 0,
        shadowOffsetY: 15,
        opacity: 0.5,
      },
      emphasis: {
        areaColor: "#0f5d9d",
      },
      regions: [
        {
          name: "南海诸岛",
          itemStyle: {
            areaColor: "rgba(0, 10, 52, 1)",
            borderColor: "rgba(0, 10, 52, 1)",
            opacity: 0,
            label: {
              show: false,
              color: "#009cc9",
            },
          },
          label: {
            show: false,
            color: "#FFFFFF",
            fontSize: 12,
          },
        },
      ],
    },
    series: [
      {
        type: "map",
        map: "china",
        aspectScale: 0.8,
        layoutCenter: ["50%", "50%"], //地图位置
        layoutSize: "100%",
        label: {
          show: true,
          color: "#FFFFFF",
          fontSize: 12,
        },
        itemStyle: {
          areaColor: "#0c3653",
          borderColor: "#1cccff",
          borderWidth: 1.8,
        },
        emphasis: {
          areaColor: "#56b1da",
          label: {
            show: true,
            color: "#fff",
          },
        },
        data: data,
      },
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin',
        symbolSize: [60, 50],
        label: {
          show: true,
          color: "#fff",
          formatter(value: any) {
            return value.data.value[2]
          }
        },
        itemStyle: {
          color: '#1E90FF', //标志颜色
        },
        data: data,
      },
    ],
  })
  charts.on('click', (e: any) => {
    gridData.value = e.data.children
    dialogTableVisible.value = true
  })
}

const initPie = () => {
  const charts = echarts.init(document.querySelector('.pie') as HTMLElement)
  charts.setOption({
    backgroundColor: "#223651",
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '15',
          }
        },
        data: store.cityDetail.map(v => {
          return {
            name: v.city,
            value: v.nowConfirm
          }
        })
      }
    ]
  })
}

const initLine = () => {
  const charts = echarts.init(document.querySelector('.line') as HTMLElement)
  charts.setOption({
    backgroundColor: "#223651",
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: store.cityDetail.map(v => v.city),
      axisLine: {
        lineStyle: {
          color: "#fff"
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: "#fff"
        }
      }
    },
    label: {
      show: true
    },
    series: [
      {
        data: store.cityDetail.map(v => v.nowConfirm),
        type: 'line',
        smooth: true
      }
    ]
  })
}
</script>


<template>
   <el-row>
    <el-col :span="24">
      <div class="top-card" v-loading="loading">
        <section>
          <div>较上日+ {{ store.chinaAdd.localConfirmH5 }}</div>
          <div>{{ store.chinaTotal.localConfirm }}</div>
          <div>本土现有确诊</div>
        </section>
        <section>
          <div>较上日+ {{ store.chinaAdd.nowConfirm }}</div>
          <div>{{ store.chinaTotal.nowConfirm }}</div>
          <div>现有确诊</div>
        </section>
        <section>
          <div>较上日+ {{ store.chinaAdd.confirm }}</div>
          <div>{{ store.chinaTotal.confirm }}</div>
          <div>累计确诊</div>
        </section>
        <section>
          <div>较上日+ {{ store.chinaAdd.noInfect }}</div>
          <div>{{ store.chinaTotal.noInfect }}</div>
          <div>无症状感染者</div>
        </section>
        <section>
          <div>较上日+ {{ store.chinaAdd.importedCase }}</div>
          <div>{{ store.chinaTotal.importedCase }}</div>
          <div>境外输入</div>
        </section>
        <section>
          <div>较上日+ {{ store.chinaAdd.dead }}</div>
          <div>{{ store.chinaTotal.dead }}</div>
          <div>累计死亡</div>
        </section>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <div class="pie" v-loading="loading"></div>
    </el-col>
    <el-col :span="12">
      <div class="line" v-loading="loading"></div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
      <el-divider />
      <div id="china" v-loading="loading"></div>
    </el-col>
  </el-row>
    <el-dialog v-model="dialogTableVisible" title="详情信息">
    <el-table :data="gridData">
      <el-table-column property="name" label="地区" />
      <el-table-column property="today.confirm" label="新增确诊" />
      <el-table-column property="total.confirm" label="累计确诊" />
      <el-table-column property="total.heal" label="治愈" />
      <el-table-column property="total.dead" label="死亡" />
    </el-table>
  </el-dialog>
</template>


<style lang="less">
  @itemColor: #41b0db;
  @itemBg: #223651;
  @itemBorder: #212028;
  * {
    padding: 0;
    margin: 0;
  }
  html, body, #app {
    height: 100%;
  }
  .top-card {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
    section {
      background: @itemBg;
      border: 1px solid @itemBorder;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      div:nth-child(2) {
        color: @itemColor;
        padding: 10px 0;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
  .pie {
    height: 250px;
  }
  .line {
    height: 250px;
  }
  #china {
    height: 500px;
    background-color: @itemBg;
  }
  .el-divider--horizontal {
    background-color: @itemBg;
    margin: 0 !important;
  }
</style>
