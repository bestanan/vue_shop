module.exports = {
  chainWebpack: config => {
    // 当前环境
    const CURRENT_ENV = process.env.NODE_ENV
    // 生产环境
    config.when(CURRENT_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
    })
    // 开发环境
    config.when(CURRENT_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}