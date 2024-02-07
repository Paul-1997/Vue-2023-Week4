import { base } from './helper.js';
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.14/vue.esm-browser.min.js';
import Cookies  from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/+esm';
import axios from 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.5/esm/axios.js';

const app = createApp({
	data() {
		return {
            onLoading :false,
			userInfo: {
				email: '',
				password: '',
			},
			errMsg: '',
		};
	},
	methods: {
		async login() {
            this.onLoading = true;

			const { email: username, password } = this.userInfo;

			if (username === '' || password === '') return (this.errMsg = '請輸入信箱或密碼！');

			try {				
				const result = await axios.post(`${base}/v2/admin/signin`,{username,password});
                const { token , expired } = result.data;				
                this.onLoading = false;
                //寫入資訊後跳轉頁面
                Cookies.set('hexToken', token, { expires: expired });                

                location.href = './index.html';
			} catch (err) {
				const { status } = err.response;

				if (status === 400) this.errMsg = '信箱或密碼有誤！';                    
			}
		},
        clearErrMsg() {
            if (!this.errMsg) return;
            else this.errMsg = '';
        }
    },
    watch:{
        errMsg(curValue){
            if(curValue && this.onLoading) this.onLoading = false; 
        }
    }
});

app.mount('#app');
