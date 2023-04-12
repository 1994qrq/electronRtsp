<script setup lang="tsx">
import { onMounted, ref } from 'vue'
import type { TableColumnCtx } from 'element-plus'
import MpegPlayer from 'jsmpeg-player'

const mpegPlayer = ref()
const player = ref(null)
const ipInfo: any = ref({
  ipaddress: '192.168.1.101',
  port: 554,
  username: 'admin',
  password: 'HnpxJg2023'
})

const linkRtspUrl = `rtsp://${ipInfo.value.username}:${ipInfo.value.password}@${ipInfo.value.ipaddress}:${ipInfo.value.port}/h264/ch1/sub/av_stream`
const open = () => {
  try {
    videoState.value.linked = true
    // @ts-ignore
    const res = window.mainApi.sendSync('openRtsp', linkRtspUrl)
    console.log(res)
    if (res.code === 200) {
      player.value = new MpegPlayer.VideoElement(mpegPlayer.value, res.ws)
    }
  } catch (error) {
    console.error(error)
  }
}
const close = () => {
  videoState.value.linked = false
  // @ts-ignore
  const res = window.mainApi.sendSync('closeRtsp', linkRtspUrl)
  if (res.code === 200) {
    // 停止 MpegPlayer 实例中创建的 WebSocket 连接
    // @ts-ignore
    player.value.destroy()
  }
}

onMounted((): void => {
  // Get application version from package.json version string (Using IPC communication)
  // @ts-ignore
  window.mainApi.receive('msgReceivedVersion', (event: Event, version: string) => {
    console.log(version)
  })
  // @ts-ignore
  window.mainApi.send('msgRequestGetVersion')
})
const menuType = ['总览', '识别状态', '视频文件管理']
const activateedType: any = ref('总览')

const zongLan: any = ref({
  zuCount: 6,
  renlianCount: 6,
  minCount: 29,
  maxCount: 34,
  totalCount: 36,
  unknownCount: 2,
  slCount: 2,
  slMin: 32,
  slMax: 37,
  xiangcha: 1
})

const titleArray = [
  '教师姓名：李晓明',
  '学校名称：山东省菏泽市职业学院',
  '班级名称：专业课厨师课',
  '上课时间:2023年03月27日 14.00.00',
  '下课时间:2023年03月27日 16.00.00'
]

const tableData = [
  {
    id: 0,
    name: '张三',
    idcardState: '尚未识别❌点击识别',
    qdState: '',
    qtState: ''
  },
  {
    id: 1,
    name: '李四',
    idcardState: '已识别✅',
    qdState: '未签到❌',
    qtState: '未签退❌'
  },
  {
    id: 2,
    name: '王五',
    idcardState: '已识别✅',
    qdState: '未签到❌',
    qtState: '未签退❌'
  },
  {
    id: 3,
    name: '刘猛',
    idcardState: '已识别✅',
    qdState: '已签到✅，识别❌',
    qtState: '未签退❌'
  },
  {
    id: 3,
    name: '刘猛',
    idcardState: '已识别✅',
    qdState: '已签到✅，识别❌',
    qtState: '未签退❌'
  },
  {
    id: 3,
    name: '刘猛',
    idcardState: '已识别✅',
    qdState: '已签到✅，识别❌',
    qtState: '未签退❌'
  },
  {
    id: 3,
    name: '刘猛',
    idcardState: '已识别✅',
    qdState: '已签到✅，识别❌',
    qtState: '未签退❌'
  },
  {
    id: 3,
    name: '刘猛',
    idcardState: '已识别✅',
    qdState: '已签到✅，识别❌',
    qtState: '未签退❌'
  },
  {
    id: 3,
    name: '刘猛',
    idcardState: '已识别✅',
    qdState: '已签到✅，识别❌',
    qtState: '未签退❌'
  },
  {
    id: 3,
    name: '刘猛',
    idcardState: '已识别✅',
    qdState: '已签到✅，识别❌',
    qtState: '未签退❌'
  }
]

interface Product {
  id: string
  name: string
  amount1: string
  amount2: string
  amount3: number
}

interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[]
  data: T[]
}
const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '统计'
      return
    }
    switch (column.property) {
      case 'idcardState':
        sums[index] = '总学员50'
        return
      case 'qdState':
        sums[index] = '已打卡38人'
        return
      case 'qtState':
        sums[index] = '未打卡12人'
        return

      default:
        break
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = `$ ${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    } else {
      console.log(2, column.property)
      sums[index] = 'N/A'
    }
  })

  return sums
}

const ipRules = ref([
  (value) => !!value || '必须输入IP地址.',
  (value) => (value || '').length <= 20 || '不能超过20个字符',
  (value) => {
    const pattern = /^(\d{1,3}\.){3}\d{1,3}$/
    return pattern.test(value) || 'IP地址有误.'
  }
])
const portRules = ref([
  (value) => !!value || '必须输入端口号.',
  (value) => (value || '').length <= 5 || '不能超过5个字符',
  (value) => {
    const pattern =
      /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/
    return pattern.test(value) || '端口号有误.'
  }
])
const userRules = ref([
  (value) => !!value || '必须输入用户名.',
  (value) => (value || '').length <= 20 || '不能超过20个字符'
])
const passRules = ref([
  (value) => !!value || '必须输入密码.',
  (value) => (value || '').length >= 5 || '不能低于5个字符'
])

const videoState = ref({
  linked: false,
  record: true,
  shared: true
})
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-col">
      <div class="bg-white w-full px-2 flex-1">
        <div class="grid grid-flow-col grid-cols-5 gap-1 items-center text-white text-lg py-2">
          <div
            class="p-1 rounded-2xl h-full border-2 text-center w-full border-red-50 border-opacity-50 items-center flex duration-150 cursor-pointer bg-green_bg"
            v-for="menu in titleArray"
            :key="menu"
          >
            <label class="w-full">{{ menu }}</label>
          </div>
        </div>
      </div>
      <div class="w-full px-2 py-2 grid grid-flow-col grid-cols-3 items-center text-white flex-1">
        <div
          :class="` rounded-md border-2 text-center text-xl border-red-50 border-opacity-50 cursor-pointer ${
            activateedType == m ? ' bg-bottom_bg' : ' bg-gray-500'
          }`"
          v-for="m in menuType"
          :key="m"
          @click="activateedType = m"
        >
          {{ m }}
        </div>
      </div>

      <div
        class="mx-2 text-center rounded-md border-2 border-gray-400 border-opacity-50 flex-1 items-center"
      >
        {{
          `识别总览：累计识别[${zongLan.zuCount}]组，人脸识别[${zongLan.renlianCount}]次，最少识别[${zongLan.minCount}]人，最多识别[${zongLan.maxCount}]人，共识别[${zongLan.totalCount}]人，`
        }}
        <label class="text-red">[{{ zongLan.unknownCount }}]</label>
        {{
          `人从未识别；数量识别[${zongLan.slCount}]次，最少识别[${zongLan.slMin}]人，最多识别[${zongLan.slMax}]人，与打卡人数相差`
        }}
        <label class="text-red">[{{ zongLan.xiangcha }}]人</label>
      </div>
    </div>
    <div
      class="grid grid-flow-col grid-cols-2 my-2 px-2 flex-auto overflow-auto"
      v-show="activateedType == '总览'"
    >
      <el-table
        :data="tableData"
        border
        height="100%"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%"
        class="mr-1"
      >
        <el-table-column prop="name" label="学员" />
        <el-table-column prop="idcardState" label="身份证状态" />
        <el-table-column prop="qdState" label="签到状态" />
        <el-table-column prop="qtState" label="签退状态" />
      </el-table>
      <div class="border-gray-300 ml-1 flex flex-col w-full">
        <div class="flex flex-col">
          <div class="flex flex-row flex-1">
            <v-btn prepend-icon="mdi-cog" class="flex-1 mr-0.5"> 视频设置 </v-btn>
            <v-btn
              prepend-icon="mdi-camera-plus"
              class="text-white flex-1 ml-0.5"
              color="#5865f2"
              variant="flat"
            >
              开始拍照
            </v-btn>
          </div>
          <div class="flex flex-row h-12 flex-1 py-2">
            <v-text-field
              class="flex-1 mr-0.5"
              label="IP地址"
              :rules="ipRules"
              v-model="ipInfo.ipaddress"
            ></v-text-field>
            <v-text-field
              class="flex-1 mr-0.5"
              label="端口"
              :rules="portRules"
              v-model="ipInfo.port"
            ></v-text-field>
            <v-text-field
              class="flex-1 mr-0.5"
              label="用户名"
              :rules="userRules"
              v-model="ipInfo.username"
            ></v-text-field>
            <v-text-field
              class="flex-1 mr-0.5"
              type="password"
              label="密码"
              :rules="passRules"
              v-model="ipInfo.password"
            ></v-text-field>
            <v-btn
              prepend-icon="mdi-shield-link-variant"
              density="default"
              :onclick="videoState.linked ? close : open"
              class="text-white flex-1 ml-0.5 border-gray-300"
              color="#5865f2"
              size="x-large"
              variant="flat"
            >
              {{ videoState.linked ? '取消连接' : '连接' }}
            </v-btn>
          </div>
          <div class="flex flex-row flex-1 py-2 items-center my-2">
            <label class="flex-1 mr-0.5 whitespace-nowrap"
              >当前状态：已连接{{ videoState.linked ? '✅' : '❌' }} 录像中{{
                videoState.record ? '✅' : '❌'
              }}
              直播中{{ videoState.shared ? '✅' : '❌' }}</label
            >
            <v-btn
              prepend-icon="mdi-camera-plus"
              class="flex-auto mr-0.5 text-white"
              color="#5865f2"
              :disabled="!videoState.record"
            >
              开始录像
            </v-btn>
            <v-btn
              prepend-icon="mdi-camera-plus"
              class="text-white flex-auto ml-0.5"
              color="#5865f2"
              :disabled="videoState.record"
            >
              停止录像
            </v-btn>
          </div>
        </div>
        <div class="flex-auto mpeg-player-wrapper overflow-auto">
          <div ref="mpegPlayer" class="h-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.mpeg-player-wrapper {
  width: 100%;
  height: 0;
}

.mpeg-player-wrapper canvas {
  width: 100%;
  height: auto;
  transform: translateY(-50%);
  top: 50%;
}
</style>
