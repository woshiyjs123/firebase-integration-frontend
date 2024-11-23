<template>
    <div>
        <div ref="echartsRef" style="width: 100%; height: 400px"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted,nextTick } from "vue";
import {
  listUserCountChart,
} from "@/api/system/user";
// 在组件中引入 ECharts 库。
import * as echarts from "echarts";

const echartsRef = ref<HTMLElement>();
const timeData = ref<any>([]);
const countData = ref<any>([]);



// 在组件的 mounted 钩子函数中初始化 ECharts 实例。
function getList() {
  listUserCountChart().then(
    (res) => {
      for (let key in res) {
            if (res.hasOwnProperty(key)) {
              timeData.value.push(key)
              countData.value.push(res[key])
            }
        }
    }
  );
}
onMounted(async() => {
  // timeData.value = []
  // countData.value = []
  await getList()
  nextTick(() => {
  // 初始化echarts实例
  let myChart: echarts.ECharts = echarts.init(echartsRef.value as HTMLElement);
  // 指定图表的配置项和数据
  let option: echarts.EChartsOption = {
        title: {
          text: '用户每日登录次数报表'
        },
        tooltip: {},
        legend: {
          data: ['次数']
        },
        xAxis: {
          data: ["2024-11-18","2024-11-19","2024-11-20","2024-11-21","2024-11-22","2024-11-23"],
        },
        yAxis: {},
        series: [
          {
            name: '访问次数',
            type: 'bar',
          data: [1,4,11,5,3,2],
          }
        ]
  };

  
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
  	});
});
</script>

