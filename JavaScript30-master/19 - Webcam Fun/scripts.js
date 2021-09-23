let type = 2
const video = document.querySelector('.player')
const canvas = document.querySelector('.photo')
const ctx = canvas.getContext('2d')
const strip = document.querySelector('.strip')
const snap = document.querySelector('.snap')

function switchType(num){
    type = num
}

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })//audio 沒有麥克風的功能
        .then(localMediaStream => {
            console.log(localMediaStream)
    
            //  DEPRECIATION : 
            //       The following has been depreceated by major browsers as of Chrome and Firefox.
            //       video.src = window.URL.createObjectURL(localMediaStream);
            //       Please refer to these:
            //       Deprecated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
            //       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
      
            video.srcObject = localMediaStream
            video.play()
        })
        .catch(err => {
            console.error('OH NO!!!', err)
        })
}

function paintToCanvas() {
    const width = video.videoWidth
    const height = video.videoHeight
    canvas.width = width
    canvas.height = height

    ctx.drawImage(video,0,0,width,height)//為了展示第一個&第二個點的顏色因此先讓手動畫
    let pixels = ctx.getImageData(0,0,width,height)
    console.log(`Aera: ${width * height},Pixels: ${pixels.data.length}`)

    console.log(pixels.data[0],pixels.data[1],pixels.data[2],pixels.data[3])//第一個點的顏色
    console.log(pixels.data[0+4],pixels.data[1+4],pixels.data[2+4],pixels.data[3+4])//第二個點的顏色

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height)
        // take the pixels out
        pixels = ctx.getImageData(0, 0, width, height)
        // mess with them
        switch (type) {
        case 1:
            pixels = redEffect(pixels)
            break
        case 2:
            pixels = rgbSplit(pixels)
            break
        case 3:
            pixels = greenScreen(pixels)
            break
        }

        pixels = rgbSplit(pixels)
        // ctx.globalAlpha = 0.8;

        // put them back
        ctx.clearRect(0,0,width,height)
        ctx.putImageData(pixels,0,0)
    },16)
}

function takePhoto() {
    // played the sound
    snap.currentTime = 0
    snap.play()

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg') //canvas 截圖 做base 64的圖
    const link = document.createElement('a')
    link.href = data
    link.setAttribute('download', 'handsome') //這download對應到html5 的下載功能
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`
    strip.insertBefore(link, strip.firstChild) //insertBefore 將一個節點安插在參考節點之前 如果把strip.firstChild 改成now 則便放在最後
}

function redEffect(pixels) { //pixels要記得要過.data不然會爆炸
    for (let i = 0; i < pixels.data.length; i+=4) {//RGBA所以1個點=4所以i=i+4 沒有人規定一定是i++
        pixels.data[i + 0] = pixels.data[i + 0] + 200 // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50 // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // Blue
    }
    return pixels
}

function rgbSplit(pixels) {//三原色位移
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0] // RED
        pixels.data[i + 500] = pixels.data[i + 1] // GREEN
        pixels.data[i - 550] = pixels.data[i + 2] // Blue
    }
    return pixels
}

function greenScreen(pixels) {
    const levels = {}

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value
    })

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0]
        green = pixels.data[i + 1]
        blue = pixels.data[i + 2]
        alpha = pixels.data[i + 3]

        if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
            // take it out!
            pixels.data[i + 3] = 0
        }
    }

    return pixels
}

getVideo()

video.addEventListener('canplay', paintToCanvas)
