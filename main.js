//遊戲的狀態
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}

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
  displayCardElement(indexes){
    const rootElement = document.querySelector('#cards')
    // 1.Array.from(Array(52).keys())的意思就是會將0 - 51的數字放入陣列裡面
    // 2.map是依序將數字丟進 view.getCardElement()
    // 3.join("") 把陣列合併成一個大字串，因為這樣才能當成 HTML template 來使用
    // 4.最後再把組合好的 template 用 innerHTML 放進 #cards 元素裡
    // rootElement.innerHTML = Array.from(Array(52).keys()).map(index => this.getCardElement(index)).join("");

    // 原先將陣列依序放入(上面那行)，但我們需要洗牌放入，所以將程式修改成以下
    // rootElement.innerHTML = utility.getRandomNumberArray(52).map(index => this.getCardElement(index)).join("");

    // 因為我們要把已經打散過的陣列傳入，然後單純讓他去做顯示的動作，所以要加入參數indexes，防止跟utility偶合，
    // 而本displayCardElement是沒有參數的，因為一開始我們的此function是來call洗牌的function，但我們現在要請controller來call洗牌function，所以她就變成說我只接受洗完牌的陣列，然後把洗牌這個function交給controller去控制
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join("");
    
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
  },

  //若成功配對讓卡片在牌桌上維持翻開
  pairCard(card) {
    card.classList.add('paired')
  },

  //顯示分數
  renderScore(score) {
    document.querySelector(".score").textContent = `Score: ${score}`;
  },
  //顯示嘗試次數
  renderTriedTimes(times) {
    document.querySelector(".tried").textContent = `You've tried: ${times} times`;
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
// view.displayCardElement()


const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  //有點像GameStart的函式
  generateCards() {
    view.displayCardElement(utility.getRandomNumberArray(52))
  },

  //依照不同的遊戲狀態，做不同的行為
  dispatchCardAction(card){
    // 做一個檢查，如果他沒有牌背的class就直接結束
    if (!card.classList.contains('back')) {
      return
    }
    //如果他是牌背的話，依照不同情況:
    switch (this.currentState) {
      // 如果他是第一張牌 >> 1翻牌 2.存入model.revealedCards陣列裡面 3.進入SecondCardAwaits狀態
      case GAME_STATE.FirstCardAwaits:
        view.flipCard(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      // 在 SecondCardAwaits 狀態點擊卡片的話，會將卡片翻開，接著檢查翻開的兩張卡是否數字相同
      case GAME_STATE.SecondCardAwaits:
        // 新增只要切換至 SecondCardAwaits，嘗試次數就要 +1
        view.renderTriedTimes(++model.triedTimes)
        view.flipCard(card)
        model.revealedCards.push(card)
        // 判斷配對是否成功
        if (model.isRevealedCardsMatched()) {
          // 配對成功 ， 1.分數就要+10 2.維持翻開 3.換底色 4.進入FirstCardAwaits狀態
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardsMatched
          view.pairCard(model.revealedCards[0])
          view.pairCard(model.revealedCards[1])
          model.revealedCards = []
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          // 配對失敗 ， 1.進入CardsMatchFailed狀態維持一秒 2.翻回背面 3.進入FirstCardAwaits狀態
          this.currentState = GAME_STATE.CardsMatchFailed
          setTimeout(() => {
            view.flipCard(model.revealedCards[0])
            view.flipCard(model.revealedCards[1])
            model.revealedCards = []
            this.currentState = GAME_STATE.FirstCardAwaits
          }, 1000)

        }
        break
    }
    console.log('this.currentState', this.currentState)
    console.log('revealedCards', model.revealedCards.map(card => card.dataset.index))
  }
}
controller.generateCards() //取代view.displayCardElement()

const model = {
  //revealedCards 是一個暫存牌組，使用者每次翻牌時，就先把卡片丟進這個牌組，集滿兩張牌時就要檢查配對有沒有成功，檢查完以後，這個暫存牌組就需要清空。
  revealedCards: [],
  //提取 revealedCards 陣列中暫存的兩個值，並用 === 比對是否相等，若相等就回傳 true，反之則為 false。
  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  score: 0,
  triedTimes: 0
}

// 加入點擊時翻牌的事件監聽器
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    controller.dispatchCardAction(card)
  })
})