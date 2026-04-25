import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    drawerOpen: false,
    showCheatSheet: false,
  }),
  actions: {
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen
    }
  }
})
