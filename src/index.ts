import { VNode, VNodeDirective } from 'vue/types/vnode'

interface LongPressHTMLElement extends HTMLElement {
    $_long_press_pointerdown_handler : () => void;
    $_long_press_top : number;
    $_long_press_left : number;
    dataset : {
        longPressTimeoutId : string;
    };
}

const longPressStop = new CustomEvent('long-press-stop')
const longPressStart = new CustomEvent('long-press-start')

export const directiveOption = {
    bind (el: LongPressHTMLElement, binding: VNodeDirective, vnode: VNode) {
        el.dataset.longPressTimeoutId = '0'

        const onpointerup = () => {
            clearTimeout(parseInt(el.dataset.longPressTimeoutId))

            if (Math.abs(el.getBoundingClientRect().top - el.$_long_press_top) < 20 &&
                Math.abs(el.getBoundingClientRect().left - el.$_long_press_left) < 20) {
                if (vnode.componentInstance) {
                    vnode.componentInstance.$emit('long-press-stop')
                } else {
                    el.dispatchEvent(longPressStop)
                }
            }

            document.removeEventListener('pointerup', onpointerup)
        }

        const onpointerdown = () => {
            document.addEventListener('pointerup', onpointerup)
            el.$_long_press_top = el.getBoundingClientRect().top
            el.$_long_press_left = el.getBoundingClientRect().left

            const timeout = setTimeout(() => {
                if (Math.abs(el.getBoundingClientRect().top - el.$_long_press_top) < 20 &&
                    Math.abs(el.getBoundingClientRect().left - el.$_long_press_left) < 20) {
                    if (vnode.componentInstance) {
                        vnode.componentInstance.$emit('long-press-start')
                    } else {
                        el.dispatchEvent(longPressStart)
                    }
                }
            }, binding.value)

            el.dataset.longPressTimeoutId = timeout.toString()
        }

        el.$_long_press_pointerdown_handler = onpointerdown;
        el.addEventListener('pointerdown', onpointerdown)
    },
    unbind (el : LongPressHTMLElement) {
        clearTimeout(parseInt(el.dataset.longPressTimeoutId))
        el.removeEventListener('pointerdown', el.$_long_press_pointerdown_handler)
    }
}

export default directiveOption
