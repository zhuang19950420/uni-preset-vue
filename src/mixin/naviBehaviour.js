import { naviBarHeight } from "../utils/util.js"

export default {
	props: {
		// 标题
		naviHeight: {
			type: Number,
			default: naviBarHeight()
		}
	},
};
