// 花色圖片
const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

const view = {
  // 取得卡片內容
  getCardElement(index){
    //卡牌數字是 index 除以 13後的「餘數 +1」，運算時記得加上 Math.floor，因為我們只需要整數。
    const number = this.transformNumber((index % 13) +1) 
    const symbols = Symbols[Math.floor(index/13)]

    return `<div class="card">
      <p>${number}</p>
      <img src="${symbols}" alt="">
      <p>${number}</p>
    </div>`
  },
  //特殊數字轉換A、J、Q、K將此函式放入上方number變數中
  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },

  // 將卡片內容放到容器裡面並顯示
  displayCardElement(){
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = this.getCardElement(13)
  }
}
view.displayCardElement()