import { defineStore } from 'pinia'
import { getData } from '../service'
import type { RootObject, Children, ChinaAdd, ChinaTotal, StatisGradeCityDetail } from './type'

export const useStore = defineStore({
  id: 'data',
  state: () => ({
    data: <RootObject>{},
    item: <Children[]>[],
    chinaAdd:<ChinaAdd>{},
    chinaTotal:<ChinaTotal>{},
    cityDetail:<StatisGradeCityDetail[]>[]
  }),
  actions: {
    async getList() {
      const result = await getData()
      this.data = result
      this.chinaAdd = this.data.diseaseh5Shelf.chinaAdd
      this.chinaTotal = this.data.diseaseh5Shelf.chinaTotal
      this.cityDetail = this.data.statisGradeCityDetail.slice(0,10)
    }
  }
})
