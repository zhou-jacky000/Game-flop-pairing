// 花色圖片
const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

const view = {
  // 取得卡片內容
  // 將牌面分開處理

  // 正面
  getCardContent(index){
    //卡牌數字是 index 除以 13後的「餘數 +1」，運算時記得加上 Math.floor，因為我們只需要整數。
    const number = this.transformNumber((index % 13) + 1)
    const symbols = Symbols[Math.floor(index / 13)]

    return `<p>${number}</p>
      <img src="${symbols}" alt="">
      <p>${number}</p>`
  },

  // 原本是將牌內容寫在這裡，但需要將牌面分開處理所以這裡只處理背面
  // 背面
  getCardElement(index){
    return `<div data-index="${index}" class="card back"></div>`
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
    // rootElement.innerHTML = Array.from(Array(52).keys()).map(index => this.getCardElement(index)).join("");
    // 原先將陣列依序放入(上面那行)，但我們需要洗牌放入，所以將程式修改成以下
    rootElement.innerHTML = utility.getRandomNumberArray(52).map(index => this.getCardElement(index)).join("");
  },

  // 新增翻牌機制
  flipCard (card){
    console.log(card)
    if (card.classList.contains('back')){
      //回傳正面
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(Number(card.dataset.index))
      return
    }
    //回傳反面
    card.classList.add('back')
    card.innerHTML = null
  }
}

// 洗牌機制
const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}
view.displayCardElement()

// 加入點擊時翻牌的事件監聽器
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    view.flipCard(card)
  })
})