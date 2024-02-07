export default {
	props: ['tempProduct','deleteProduct'],
	template: `<div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true" ref="deleteModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header justify-content-start alert alert-danger mb-0 border-0 border-bottom border-light" role="alert">
                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                    <h5 class="modal-title">								
                        確定要刪除  {{ tempProduct.title }}  嗎?
                        <span class="fs-6 align-middle">(不可復原)</span>			
                    </h5>
                </div>
                <div class="modal-footer border-0 py-2">
                    <button	
                        type="button"
                        class="btn btn-outline-secondary"
                        @click="closeModal()">
                        取消
                    </button>
                    <button type="button" class="btn btn-danger" @click="deleteProduct(tempProduct.id)">
                        刪除
                    </button>
                </div>
            </div>
        </div>
    </div>`,
	data() {
		return {
			deleteModal: null,
		};
	},
    methods:{
        openModal(){
            this.deleteModal.show();
        },
        closeModal(){
            this.deleteModal.hide();
        }
    },
	mounted() {
		this.deleteModal = new bootstrap.Modal(this.$refs.deleteModal);
	},
};
