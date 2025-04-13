// ==UserScript==
// @name         快速跳转萌百跳转
// @namespace    https://github.com/Zao-chen/Bangumi2Wiki
// @version      0.7
// @description  在 Bangumi 条目页面 infobox 顶部添加“萌娘百科”按钮，点击跳转至对应页面
// @match        https://bangumi.tv/subject/*
// @match        https://bgm.tv/subject/*
// @match        https://chii.in/subject/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

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

    console.log("中文名是：", chineseTitle);

    // 如果没有中文名则退出
    if (!chineseTitle) return;

    // 处理中文名，去除 "第x季" 部分
    chineseTitle = chineseTitle.replace(/第.*季/g, '').trim();

    console.log("处理后的中文名是：", chineseTitle);

    const infobox = document.querySelector('#infobox');
    const firstLi = infobox?.querySelector('li');

    if (infobox && firstLi) {
        // 创建按钮
        const button = document.createElement("button");
        button.textContent = "萌娘百科";
        button.style.padding = "6px 12px";
        button.style.marginBottom = "6px";
        button.style.backgroundColor = "#ff69b4";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "6px";
        button.style.fontSize = "13px";
        button.style.boxShadow = "0 1px 4px rgba(0,0,0,0.2)";
        button.style.cursor = "pointer";

        button.addEventListener("mouseover", () => {
            button.style.backgroundColor = "#ff85c1";
        });
        button.addEventListener("mouseout", () => {
            button.style.backgroundColor = "#ff69b4";
        });

        button.addEventListener("click", () => {
            const url = `https://zh.moegirl.org.cn/${encodeURIComponent(chineseTitle)}`;
            window.open(url, "_blank");
        });

        // 插入一个 li 元素作为容器
        const wrapper = document.createElement("li");
        wrapper.appendChild(button);

        // 插入到 infobox 的第一个 li 前
        infobox.insertBefore(wrapper, firstLi);
    }
})();
