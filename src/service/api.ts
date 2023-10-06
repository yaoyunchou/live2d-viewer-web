import axios, { AxiosResponse } from 'axios';

// 定义 API 响应数据的类型
interface ApiResponse {
  id: number;
  name: string;
  email: string;
}

// 获取对应的信息
// axios.get<ApiResponse>('https://api.example.com/users')
//   .then((response: AxiosResponse<ApiResponse>) => {
//     const data = response.data;
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });



// 音频播放完成后，通知控制器
export const  playCtrl = () => {
  axios.post<ApiResponse>('/api/play',{
   
    message: '[stop]'
    
  })
  .then((response: AxiosResponse<ApiResponse>) => {
    const data = response.data;
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
}

