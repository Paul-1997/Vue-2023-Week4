import { base, authToken } from './helper.js';
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.14/vue.esm-browser.min.js';
import Cookies from 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/+esm';
import axios from 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.5/esm/axios.js';

//component
import ProductModal from './component/ProductModal.js';
import DeleteModal from './component/DeleteModal.js';
import Pagination from './component/Pagination.js';
const app = createApp({
	data() {
		return {
			//狀態控制
			isLogin: false,
			getProductFailure: false,
			submitProductError: false,
			isUpdating: false,
			//使用者反饋訊息
			statusMsg: '',
			//產品內容
			products: [],
			temp: {},
			//pagination
			pages:{}
		};
	},
	methods: {
		async checkLogin() {
			try {
				const result = await axios.post(
					`${base}/v2/api/user/check`,
					{},
					authToken
				);
				this.isLogin = true;
				this.getProduct();
			} catch (err) {
				// const { status } = err.response;

				if (err?.response?.status === 403 || err?.response?.status === 401)
					alert('驗證失敗，請重新登入！');
				location.href = 'login.html';
			}
		},
		async getProduct(page = 1) {
			try {
				const result = await axios.get(
					`${base}/v2/api/paul7426/admin/products?page=${page}`,
					authToken
				);
				console.log(result.data,page)
				this.isUpdating = false;
				this.products = result.data.products;
				this.pages = result.data.pagination;
			} catch (err) {
				if (err) this.getProductFailure = true;
			}
		},
		async deleteProduct(id) {
			try {
				this.closeModal('delete');
				this.isUpdating = true;
				const result = await axios.delete(
					`${base}/v2/api/paul7426/admin/product/${id}`,
					authToken
				);
				this.statusMsg = result.data.message;
				this.getProduct();
			} catch (err) {
				const errMsg = err?.response?.data.message;
				this.statusMsg = errMsg + '  請重新嘗試!';
				this.isUpdating = false;
			}
		},
		openModal(id, isDelete = false) {
			const item = id
				? { ...this.products.find(product => product.id === id) }
				: { isNew: true, imagesUrl: [] };
			this.temp = item;
			isDelete
				? this.$refs.deleteModal.openModal()
				: this.$refs.productModal.openModal();
		},
		closeModal(modal) {
			//清除模板
			this.temp = {};
			//清除條件
			this.showEditImage = false;
			this.$refs[`${modal}Modal`].closeModal();
		},
		async getEmitUpdateProduct(product) {
			console.log(product);
			//使用者反饋狀態處理
			if (this.submitProductError)
				this.submitProductError = !this.submitProductError;

			const { title, category, unit, origin_price, price } = product;
			//確保必填項目都有填寫
			if (
				[title, category, unit, origin_price, price].every(value =>value === '' || value === undefined)
				)
				return this.submitProductError = true
			//資料處理
			let method;
			let url = base;
			if (product.isNew) {
				method = 'post';
				url += '/v2/api/paul7426/admin/product';
				delete product.isNew;
			} else {
				method = 'put';
				url += `/v2/api/paul7426/admin/product/${product.id}`;
			}
			//資料傳送
			try {
				this.isUpdating = true;
				this.closeModal('product');
				const result = await axios[method](url, { data: product }, authToken);
				this.statusMsg = result.data.message;
				this.getProduct();
			} catch (err) {
				this.isUpdating = false;
				this.submitProductError = true;
				this.statusMsg = err?.response?.message + '請重新嘗試!';
			}
		},
	},
	computed: {
		statusMsgColor() {
			if (!this.statusMsg) return '';
			return this.statusMsg.endsWith('請重新嘗試!')
				? 'text-danger'
				: 'text-success';
		},
		//稍微排序一下
		sortProducts() {
			return [...this.products].sort((a, b) => {
				if (a.category === b.category) return a.price - b.price;
				return a.category > b.category ? 1 : -1;
			});
		},
	},
	watch: {
		//重新取完資料後再清除資訊
		isUpdating(curr) {
			if (curr === false && this.statusMsg)
				setTimeout(() => (this.statusMsg = ''), 1000);
		},
	},
	components: {
		ProductModal,
		DeleteModal,
		Pagination
	},
	mounted() {
		this.checkLogin();
		
	},
});

app.mount('#app');
