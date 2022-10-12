import { ref, onMounted } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'

export default function() {
	const navBar = ref(null)

	onPageScroll((e) => {
		navBar.value.handlePageScroll(e)
	})

	return {
		navBar
	}
}
