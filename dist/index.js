const longPressStop = new CustomEvent('long-press-stop');
const longPressStart = new CustomEvent('long-press-start');
export const directiveOption = {
    bind(el, binding, vnode) {
        el.dataset.longPressTimeoutId = '0';
        const onpointerup = () => {
            clearTimeout(parseInt(el.dataset.longPressTimeoutId));
            if (Math.abs(el.getBoundingClientRect().top - el.$_long_press_top) < 10) {
                if (vnode.componentInstance) {
                    vnode.componentInstance.$emit('long-press-stop');
                }
                else {
                    el.dispatchEvent(longPressStop);
                }
            }
            document.removeEventListener('pointerup', onpointerup);
        };
        const onpointerdown = () => {
            document.addEventListener('pointerup', onpointerup);
            el.$_long_press_top = el.getBoundingClientRect().top;
            const timeout = setTimeout(() => {
                if (Math.abs(el.getBoundingClientRect().top - el.$_long_press_top) < 10) {
                    if (vnode.componentInstance) {
                        vnode.componentInstance.$emit('long-press-start');
                    }
                    else {
                        el.dispatchEvent(longPressStart);
                    }
                }
            }, binding.value);
            el.dataset.longPressTimeoutId = timeout.toString();
        };
        el.$_long_press_pointerdown_handler = onpointerdown;
        el.addEventListener('pointerdown', onpointerdown);
    },
    unbind(el) {
        clearTimeout(parseInt(el.dataset.longPressTimeoutId));
        el.removeEventListener('pointerdown', el.$_long_press_pointerdown_handler);
    }
};
export default directiveOption;
//# sourceMappingURL=index.js.map