(function(){
    let timer
    const buttons = document.querySelectorAll('.timer__controls > button')
    const timeLeft = document.querySelector('.display__time-left')
    const endTime = document.querySelector('.display__end-time')
    const startTimer = function(sec){
        const now = Date.now()// = +new Date() = Date.now() = new Date().valueof()  +可以轉型但不要用會被貶XD 2,3,4或new Date.getTime()都可以
        const end = now + sec * 1000//因為now是毫秒
        //倒數計時
        //setCountDown(end)
        setAnimationFrame(end)
        //顯示最後時間
        showEndTime(end)
    }

    //倒數計時的function
    // function setCountDown(end){
    //     clearInterval(timer)//啟動前先清除舊的計時器
    //     timer = setInterval(function(){
    //         const secLeft = Math.floor((end - Date.now()) / 1000)//結束的時間 - 當前時間
    //         if(secLeft >= 0 ){
    //             let displayMin = Math.floor(secLeft / 60)//floor無條件捨去
    //             const displaySec = secLeft % 60
    //             displayMin = displayMin < 10 ? '0' + displayMin : displayMin//這判斷是主要是拿來補畫面ㄉ0
    //             timeLeft.innerText = `${displayMin}:${displaySec}`
    //         } else {
    //             timeLeft.innerHTML = 'Happy Finish !'
    //             clearInterval(timer)
    //         }
    //     },16)//刷新時間 1sec / 16 正常設16因為60ps=1秒16次
    // }

    //改用setAnimationFrame做
    function setAnimationFrame(end){
        window.cancelAnimationFrame(timer)
        timer = window.requestAnimationFrame(function(){
            const secLeft = Math.floor((end - Date.now()) / 1000)
            if(secLeft >= 0 ){
                let displayMin = Math.floor(secLeft / 60)
                const displaySec = secLeft % 60
                displayMin = displayMin < 10 ? '0' + displayMin : displayMin
                timeLeft.innerText = `${displayMin}:${displaySec}`
                setAnimationFrame(end)
            } else {
                timeLeft.innerHTML = 'Happy Finish !'
                
            }
        })
    }

    //顯示最後時間的function
    function showEndTime(time){//也可以不用這個function但拆開可以讓每個function變小而且有針對性
        const endDate = new Date(time)
        let hour = endDate.getHours()
        let min = endDate.getMinutes()//getUTCMinutes() UTC = 從0開始
        min = min < 10 ? '0' + min : min//這判斷是主要是拿來補畫面ㄉ0
        endTime.innerText = `Back at ${hour}:${min}`
    }

    //處理輸入
    const setTimer = function(){
        const sec = parseInt(this.dataset.time)//將字串轉數字
        startTimer(sec)//把值丟給計時器
    }
    
    buttons.forEach(button => button.addEventListener('click',setTimer))
    document.querySelector('#custom').addEventListener('submit',function(e){//抓input的值
        e.preventDefault()//擋掉跳轉
        let value = parseInt(this.minutes.value)//轉數值
        if(value){
            startTimer(value * 60)//把值丟給計時器 分鐘轉秒
            this.reset()//讀取完清除
        }
    })





    //額外補充
    // const switchMap = {
    //     1: A,
    //     2: B,
    //     3: C
    // }
    // function text(aa){
    //     if(switchMap[aa]) switchMap[aa]()
    //     else D()

    //上方寫法+宣告等於下面的switch但從判斷是變查找 更容易理解
    // switch(aa){
    //     case 1;
    //     A()
    //     break
    //     case 2
    //     B()
    //     break
    //     case 3
    //     C()
    //     break
    //     default
    //     D()
    // }
    // }

    //教學 requestAnimationFrame 畫面更新頻率
//     let limit = 100
//     const rafCallback = function(){
//         console.log(limit)
//         if(limit > 0){
//             limit--
//             requestAnimationFrame(rafCallback)//要再呼叫自己一次 讓他循環執行
//         }
//     }
//     window.requestAnimationFrame(rafCallback)//啟動
})()