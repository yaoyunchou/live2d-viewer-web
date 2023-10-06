// 创建 <audio> 元素
let mainAudioList:{[key:string]:HTMLAudioElement }  = {}




// 控制停止
// audio.currentTime = 0;  // 将音频播放位置设置为起

export const creatAudio =(id:string) => {
    const mainAudio = document.createElement('audio');
    // 添加到页面中
    document.body.appendChild(mainAudio);
    mainAudioList[id] = mainAudio;
}
export const destroyed=(id: string)=>{
    mainAudioList[id].remove()
    delete mainAudioList[id]
}

export const audioPlay =(id:string,text: string, callBack?:Function) => {
    const audio = mainAudioList[id];
    // 设置属性
    audio.src = `http://127.0.0.1:23456/voice/vits?text=${text}&id=18&format=mp3&lang=zh&length=0.9&noise=0&noisew=0.6`;  // 替换为你的音频文件路径
    // mainAudio.controls = true;   // 显示播放控件
    // 控制播放
    audio.play();   // 播放音频
   
    audio.addEventListener('timeupdate', () => {
        // 获取当前播放时间
        const currentTime = audio.currentTime;
        
        // 获取总时长
        const duration = audio.duration;
        
        // 执行相应的操作，例如更新播放进度条
        if(audio.ended) {
            console.log('播放完成了!!!')
            callBack && callBack(audio, audio.currentTime)

        }
      });
}

export const baiduPlay =(id:string,src: string, callBack?:Function) => {
    const audio = mainAudioList[id];
    // 设置属性
    audio.src= src // 替换为你的音频文件路径
    // mainAudio.controls = true;   // 显示播放控件
    // 控制播放
    audio.autoplay = true;   // 播放音频
    audio.play()
    let flag = true// 正在播放, 播放完成后依旧会触发timupdate, 所以加一个锁， 播放完成一次后就关闭掉
    audio.addEventListener('timeupdate', () => {
        // 获取当前播放时间,
        const currentTime = audio.currentTime;
        
        // 获取总时长
        const duration = audio.duration;
        
        // 执行相应的操作，例如更新播放进度条
        if(audio.ended && flag) {
            console.log('播放完成了!!!')
            flag = false
            callBack && callBack(audio, audio.currentTime)

        }
      });
}