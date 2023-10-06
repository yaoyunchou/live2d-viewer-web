// import WebSocket from 'ws';

import _ from "lodash";

export default class WebSocketService {
  private socket: WebSocket;
  private fnList: {[key: string]: Function | null} = {}

  constructor(url?:string) {
    this.socket = new WebSocket(url || 'ws://127.0.0.1:3000');
    this.socket.onopen = this.onOpen;
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onclose = this.onClose;
    this.socket.onerror = this.onError;
    this.fnList = {}
  }

  private onOpen() {
    console.log('WebSocket connection opened');
  }

  private onMessage(event: MessageEvent) {
    console.log('Received message:', event.data);
    console.log('----------------------------', this.fnList)
    _.isObject(this.fnList) && Object.values(this.fnList).forEach(fn => {
        if(fn) {
            fn(event)
        }
    })
    //
  }
  public registerList(fn: Function,name: string) {
    
    // 放入
    this.fnList[name || fn.name] = fn
    //
  }
  public unRregisterList(fn: Function,name: string) {
    // 删除对应的页面
    delete this.fnList[name || fn.name]
    //
  }
  private onClose() {
    console.log('WebSocket connection closed');
  }

  private onError(error:  Event) {
    console.error('WebSocket error:', error);
  }

  public send(message: string) {
    this.socket.send(message);
  }
}