import {
    COUNT_NUMBER,
    COUNT_NUMBER_SHALLOW,
    ORIGIN_COLOR,
    ORIGIN_COLOR_SHALLOW,
    PRIMARY_COLOR,
} from "./constants";
export function setColor(a, b, c, d, e) {
    // 顶部菜单背景色
    document.body.style.setProperty('--color', a);
    document.body.style.setProperty('--color_shallow', b);
    // 首页颜色
    document.body.style.setProperty('--count_number', c);
    document.body.style.setProperty('--count_number_shallow', d);
    // 主颜色
    document.body.style.setProperty('--primary_color', e);
}
export function setDefaultTheme() {
    setColor(ORIGIN_COLOR, ORIGIN_COLOR_SHALLOW, COUNT_NUMBER, COUNT_NUMBER_SHALLOW, PRIMARY_COLOR);
}