<template>
  <div class="notfound">
    <section>
      <h3>404 Page Not Found</h3>
      <p>页面无法找到奥~</p>
      <img src="../assets/notfound.jpg" alt="">
    </section>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.notfound {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  section {
    h3, p {
      text-align: center;
    }
    p {
      font-size: 14px;
      color: #409EFF;
    }
    img {
      width: 200px;
    }
  }
}
</style>