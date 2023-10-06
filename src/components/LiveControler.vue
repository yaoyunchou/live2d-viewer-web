<template>
  <ul :class="['live']">
    <li class="live-config-item" v-for="action in actionConfigs">
        <span>{{action.action}}</span>
        <input v-model="action.name" />
        <input v-model="action.index" />
        <button @click="actionClick(action)"> {{action.action}}</button>
    </li>
   
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import { App } from '@/app/App';
import { ModelEntity } from '@/app/ModelEntity';
import { Live2DModel } from '@/app/Live2DModel';
import { MotionPriority, MotionState } from 'pixi-live2d-display';
import WebSocketService from '@/utils/websocket';
import { baiduPlay, creatAudio, destroyed } from '@/service/audio';
import { baiduAudioPlay } from '@/service/baidu';
import { playCtrl } from '@/service/api';
interface MotionGroupEntry {
    name: string
    motions: {
        file: string;
        error?: any;
    }[]
}

interface ActionInfo {
    name: number
    index: number
    action: string
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
        webSocketService:null as unknown as WebSocketService,
        actionConfigs: [
            {
                action: 'speek',
                name:0,
                index:0
            },
             { action: 'loop',
                name:0,
                index:0
            }
        ],
        index:0,
        model: null as ModelEntity | null | undefined,
        motionGroups: [] as MotionGroupEntry[],
    }),
    created() {
        this.webSocketService = new WebSocketService();
        this.webSocketService.registerList(this.onMessage, 'livePage')
        creatAudio('livePage')
    },
    destroyed(){
        destroyed('livePage')
    },
    mounted(){
        // 获取数据， 进行交互

    },
    watch: {
        id: {
            immediate: true,
            handler() {
                this.updateModel();
            },
        }
    },
    methods: {
        actionClick(action:ActionInfo) {
            const name = this.motionGroups[action.name]?.name
            const index = action.index
            console.log('========action==========', name, index, action)

            this.model?.pixiModel?.motion(name, index, MotionPriority.FORCE);
        },
        updateModel() {
            this.model = App.getModel(this.id);
            if (this.model) {
                if (this.model.pixiModel) {
                    this.pixiModelLoaded(this.model.pixiModel);
                } else {
                    this.model.once('modelLoaded', this.pixiModelLoaded);
                }
            }
        },
      
        pixiModelLoaded(pixiModel: Live2DModel) {
            const motionManager = pixiModel.internalModel.motionManager;
            const motionGroups: MotionGroupEntry[] = [];

            const definitions = motionManager.definitions;

            for (const [group, motions] of Object.entries(definitions)) {
                motionGroups.push({
                    name: group,
                    motions: motions?.map((motion, index) => ({
                        file: motion.file || motion.File || '',
                        error: motionManager.motionGroups[group]![index]! === null ? 'Failed to load' : undefined,
                    })) || [],
                });
            }

            this.motionGroups = motionGroups;
        },
        loop(){},
        speak() {
            console.log('---spake--------',  this.actionIndex, this.index)
            const actionName = this.motionGroups[this.actionIndex]?.name
            console.log('----actionName----', actionName)
            this.model?.pixiModel?.motion(this.motionGroups[this.actionIndex]?.name, this.index, MotionPriority.FORCE);
        },
        onMessage(data: any) {
                console.log('===========livePage======================', data)
                const message = JSON.parse(data?.data)
                // this.messages.push({ user: 'server', id: Date.now(), text: message.message});
                // 获取到文本数据， 将文本转语音
                if(message?.audio){
                  this.speak()
                  baiduPlay('livePage', message.audio , () => {
                    playCtrl()
                })
                  
                }else{
                  baiduAudioPlay(message.message, playCtrl, 'livePage')

                }
            }
    }
});
</script>

<style scoped lang="stylus">
.live
    width 100%
    padding 20px
    position  fixed
    z-index  1000
    bottom 0
    background pink
    pointer-events auto
    .live-config-item
        list-style none

</style>
