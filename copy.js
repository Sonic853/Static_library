/**
 * 复制文字到剪贴板
 * @param {string} value 
 */
const CopyText = async (value) => {
    if (navigator?.clipboard?.writeText) {
        return await navigator.clipboard.writeText(value);
    }
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}