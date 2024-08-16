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
    // 1.Array.from(Array(52).keys())的意思就是會將0 - 51的數字放入陣列裡面
    // 2.map是依序將數字丟進 view.getCardElement()
    // 3.join("") 把陣列合併成一個大字串，因為這樣才能當成 HTML template 來使用
    // 4.最後再把組合好的 template 用 innerHTML 放進 #cards 元素裡
    rootElement.innerHTML = Array.from(Array(52).keys()).map(index => this.getCardElement(index)).join("");
  }
}
view.displayCardElement()