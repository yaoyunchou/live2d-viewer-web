<template>
    <div class="chat-box">
      <v-card>
        <v-card-title>聊天记录</v-card-title>
        <v-card-text class="chat-box-in">
          <div v-for="message in messages" :key="message.id">
            {{ message.text }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-text-field v-model="newMessage" @keyup.enter="sendMessage" label="Type a message" outlined></v-text-field>
          <v-btn class="send-btn" @click="sendMessage"  color="#5865f2">发送</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </template>
  
 
  
  <script lang="ts">
import { playCtrl } from '@/service/api';
import { baiduPlay, creatAudio } from '@/service/audio';
import { baiduAudioPlay } from '@/service/baidu';
import WebSocketService from '@/utils/websocket';
import Vue from 'vue';
  interface MotionGroupEntry {
      name: string
      motions: {
          file: string;
          error?: any;
      }[]
  }

  interface MessageVo {
      name?: string,
      user: 'web' | 'system'|'server'
      id: number, 
      text: string
  }
  export default Vue.extend({
      name: "DropZone",
      props: {
          id: {
              type: Number,
              default: 0,
          }
      },
      data: () => ({
           name: 'yaoyc',
           messages: [] as MessageVo[],
            newMessage: '',
            webSocketService: null as unknown as WebSocketService
      }),
     
      mounted(){
      
      },
      created() {
        this.webSocketService = new WebSocketService();
        this.webSocketService.registerList(this.onMessage, 'chatPage')
        creatAudio('chatPage')
      },
      methods: {
          handler:() =>{
            console.log('========handler======')
          },
           // 获取数据， 进行交互
           sendMessage() {
                if (this.newMessage) {
                    this.webSocketService.send(JSON.stringify({message:this.newMessage, type: 'question', }));
                    this.messages.push({ user: 'web', id: Date.now(), text: this.newMessage });
                    this.newMessage = '';
                    
                }
            },
            onMessage(data: any) {
                console.log('===========chatPage======================', data)
                const message = JSON.parse(data?.data)
                this.messages.push({ user: 'server', id: Date.now(), text: message.message});
                // 获取到文本数据， 将文本转语音
                if(message?.audio){
                  baiduPlay('chatPage', message.audio   , playCtrl)

                }else{
                  baiduAudioPlay(message.message, playCtrl, 'chatPage')
                  
                }
            }
      }
  });
  </script>
  
  <style scoped lang="stylus">
  .home
      width 100%
      height 100vh
      padding 20px
      position  fixed
      z-index  1000
      bottom 0
      background pink
      pointer-events auto
  .chat-box
    background #ffffff
    height 100vh
    .chat-box-in 
        max-height calc(100vh - 166px)
        overflow-y auto
    .send-btn
        color #ffffff
    ::v-deep .v-card__actions
        align-items normal
  </style>
  