export const state = () => ({
    nowPlaying: 0,
    lastPage: 0,
})
  
export const mutations = {
    setPlaying(state, id) {
        state.nowPlaying = id
    },
    setLastPage(state, page) {
        state.lastPage = page
    }
}

export const actions = {
    setPlaying({commit}, id) {
        commit('setPlaying', id)
    },
    setLastPage({commit}, page) {
        commit('setLastPage', page)
    }
}

export const getters = {
    nowPlaying(state) {
        return state.nowPlaying
    },
    lastPage(state) {
        return state.lastPage
    }
}
