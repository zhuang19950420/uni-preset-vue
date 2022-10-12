import { ref, onMounted } from 'vue'
import navigator from '../manager/navigator'

export default function() {
  const onBlockClick = function(block) {
    navigator.setContent(block).action()
  }

  return {
    onBlockClick
  }
}
