/* Get Our Elements */
const player = document.querySelector('.player')
const video = player.querySelector('.viewer')
const progress = player.querySelector('.progress')
const progressBar = player.querySelector('.progress__filled')
const toggle = player.querySelector('.toggle')
const skipButtons = player.querySelectorAll('.skip') //改用class選取 效能會好一點
const ranges = player.querySelectorAll('.player__slider')

/* Build out functions */
function togglePlay() {
    const method = video.paused ? 'play' : 'pause' 
    video[method]() 

    //以下為function的寫法但容易出現的問題

// toggle.textContent = this.paused ? '►' : '❚ ❚';  把button的功能寫近來
// updateButton() 一起呼叫但就會有問題了
// if(xxx) video.play(){  原始為了縮寫改用三元運算 等於if這 
//} else video.pause(){}
//中括號不只是陣列也可以取key值或index值 就可以取代掉上面的video.play 跟 video.pause
}

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚'
    console.log(icon)
    toggle.textContent = icon
}

function skip() { //+10 &+20
    video.currentTime += parseFloat(this.dataset.skip)
} //currentTime 現在撥放時間  parseFloat 吃浮點數 一般會用parseInt 整數化

function handleRangeUpdate() {
    // 控制 volume聲音 ,playbackRate 
    //video.volume,video.playbackRate
    video[this.name] = this.value //組合式的function控制
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100
    progressBar.style.flexBasis = `${percent}%`
} //flexBasis預設寬度 播放進度條

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration //算滑鼠座標 offsetX offsetWidth整個寬度(百分比)
    video.currentTime = scrubTime
} //duration 總時間

/* Hook up the event listeners */

//使用者操作影片 影片操作事件(event) 因為addEvent 事件觸發update Button 這樣就不會有耦合的情況發生 才不會互相控制到
//把所有的切換都個別設在不同的控制 未來debug時就可以看出來哪個控制哪個時有問題 Video狀態改畫面 video狀態會被togglePlay修改

video.addEventListener('click', togglePlay) //這邊特別作了一個click來做togglePlay 就會有play事件 跟pause事件
video.addEventListener('play', updateButton) //然後監聽上面的出現的paly事件
video.addEventListener('pause', updateButton) //然後監聽上面的出現的pause事件
video.addEventListener('timeupdate', handleProgress)

toggle.addEventListener('click', togglePlay) //跟上面的video一樣都會改變撥放狀態然後改變paly跟pause

//把skip整合如果未來要多做就在html多加一個button就可以了
skipButtons.forEach(button => button.addEventListener('click', skip))
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate))
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate))

let mousedown = false //監聽滑鼠來做撥放進度的拖曳 的狀態調整
progress.addEventListener('click', scrub)
progress.addEventListener('mousemove', (e) => mousedown && scrub(e))

//progress.addEventListener('mousemove', function(e){ if(mousedown){scrub(e)} }一般會這樣寫 這邊用&&來取代 如果前面是對的就做後面


progress.addEventListener('mousedown', () => mousedown = true)
progress.addEventListener('mouseup', () => mousedown = false)

