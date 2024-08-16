const view = {
  // 取得卡片內容
  getCardElement(){
    return `<div class="card">
      <p>7</p>
      <img src="https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png" alt="">
      <p>7</p>
    </div>`
  },
  // 將卡片內容放到容器裡面並顯示
  displayCardElement(){
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = this.getCardElement()
  }
}
view.displayCardElement()