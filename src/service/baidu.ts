import { audioPlay, baiduPlay } from "./audio";

const axios = require('axios')
const AK = "KR0OwpKEkrx6lesbK2V189S3"
const SK = "oedQunOt9VUog8GpR09s2YvZjtnXvBgu"
let access_token: string = ''  //


export async function baiduAudioPlay(text:string, callBack:Function,id:string) {
    var options = {
        'method': 'POST',
        'url': 'https://tsn.baidu.com/text2audio',
         'responseType':'arraybuffer',
        //  'responseType':'blob',
        'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*'
        },
        data: {
                'tok': access_token,
                'tex': text,
                'cuid': 'BBWUVvVKKNyfGNEH2JaQMhfY0BA5cXSv',
                'ctp': '1',
                'lan': 'zh',
                'spd': '5',
                'pit': '5',
                'vol': '5',
                'per': '5118',
                'aue': '3'
        }
    };

    axios(options).then((response:any,error:any) =>{
        if (error) throw new Error(error);
        console.log('-----------------', response)
        // 转换为字符串
        const arrayBuffer = new Uint8Array(response.data).buffer; 
        const uint8Array = new Uint8Array(arrayBuffer);

        // 将 Uint8Array 转换为字符串
        let binaryString = '';
        uint8Array.forEach((byte) => {
          binaryString += String.fromCharCode(byte);
        });

        if(binaryString.indexOf('"err_subcode"') !== -1){
            getAccessToken().then((res) => {
                console.log('=========',res)
                baiduAudioPlay(text, callBack, id)
            })
        }else{
            // 将字符串转换为 Base64 字符串
            const base64String = btoa(binaryString);
            baiduPlay(id, `data:audio/mp3;base64,${base64String}`, callBack)
        }
      
    });
}

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
export function getAccessToken() {

    let options = {
        'method': 'POST',
        'url': '/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
    }
    return new Promise((resolve, reject) => {
        axios(options).then((response:any,error:any) => {
            access_token = response?.data?.access_token
            resolve(access_token) 
        })
    })
    // 音频播放完成后，通知控制器

  }
  
  

