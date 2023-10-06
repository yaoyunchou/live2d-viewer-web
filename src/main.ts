import Vue from 'vue';

import IndexApp from './Index.vue';
import vuetify from './plugins/vuetify';
import { config } from 'pixi-live2d-display';
import { App } from '@/app/App';
import router from './router'; // 导入刚刚创建的路由实例
Vue.config.productionTip = false;

Vue.directive('visible', function(el, binding) {
    el.style.visibility = !!binding.value ? 'visible' : 'hidden';
});

(window as any).vueApp = new (Vue as any)({
    vuetify,
    router,
    render: (h: any) => h(IndexApp),
}).$mount('#app');

(window as any).App = App;
(window as any).config = config;

config.logLevel = config.LOG_LEVEL_VERBOSE;
