// ==UserScript==
// @name         快速跳转萌娘百科
// @namespace    https://github.com/Zao-chen/Bangumi2Wiki
// @version      1.2
// @description  在 Bangumi 条目 infobox 顶部添加“萌娘百科”按钮，支持长按设置跳转前缀
// @match        https://bangumi.tv/subject/*
// @match        https://bgm.tv/subject/*
// @match        https://chii.in/subject/*
// @grant        none
// @license MIT
// ==/UserScript==

(function () {
    'use strict';

    const LOCAL_KEY = 'moegirl_base_url';
    const DEFAULT_URL = 'https://zh.moegirl.org.cn/';
    const baseUrl = localStorage.getItem(LOCAL_KEY) || DEFAULT_URL;

    // 查找 infobox 内 span.tip 的 li 里中文名
    const tips = document.querySelectorAll('#infobox li span.tip');
    let chineseTitle = null;

    for (const tip of tips) {
        if (tip.textContent.trim().startsWith("中文名")) {
            const li = tip.closest('li');
            if (li) {
                chineseTitle = li.textContent.replace(/^中文名:\s*/, '').trim();
                break;
            }
        }
    }

    if (!chineseTitle) return;

    // 去除“第x季”字样
    chineseTitle = chineseTitle.replace(/第.*季/g, '').trim();

    const infobox = document.querySelector('#infobox');
    const firstLi = infobox?.querySelector('li');

    if (infobox && firstLi) {
        const button = document.createElement("button");
        button.textContent = "萌娘百科";
        styleButton(button);

        let pressTimer = null;

        button.addEventListener("mousedown", () => {
            pressTimer = setTimeout(() => {
                const newUrl = prompt("请输入新的萌百前缀地址（以 / 结尾）", baseUrl);
                if (newUrl && newUrl.startsWith('http') && newUrl.endsWith('/')) {
                    localStorage.setItem(LOCAL_KEY, newUrl);
                    alert("已保存新前缀，刷新页面以生效！");
                } else if (newUrl) {
                    alert("地址格式无效，请确保以 http 开头并以 / 结尾。");
                }
            }, 800); // 长按时长
        });

        button.addEventListener("mouseup", () => clearTimeout(pressTimer));
        button.addEventListener("mouseleave", () => clearTimeout(pressTimer));
        button.addEventListener("click", () => {
            // 只有没有触发长按时才跳转
            if (pressTimer) {
                const url = `${localStorage.getItem(LOCAL_KEY) || DEFAULT_URL}index.php?search=${encodeURIComponent(chineseTitle)}`;
                window.open(url, "_blank");
            }
        });

        const wrapper = document.createElement("li");
        wrapper.appendChild(button);
        infobox.insertBefore(wrapper, firstLi);
    }

    function styleButton(btn) {
        btn.style.padding = "6px 12px";
        btn.style.backgroundColor = "#ff69b4";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.fontSize = "13px";
        btn.style.boxShadow = "0 1px 4px rgba(0,0,0,0.2)";
        btn.style.cursor = "pointer";
        btn.style.userSelect = "none";
        btn.addEventListener("mouseover", () => {
            btn.style.backgroundColor = "#ff85c1";
        });
        btn.addEventListener("mouseout", () => {
            btn.style.backgroundColor = "#ff69b4";
        });
    }
})();
