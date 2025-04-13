// ==UserScript==
// @name         快速跳转萌娘百科
// @namespace    https://github.com/Zao-chen/Bangumi2Wiki
// @version      1.4.0
// @description  在 Bangumi 条目 infobox 顶部添加“萌娘百科”按钮，支持长按设置跳转链接模板（支持占位符）
// @match        https://bangumi.tv/subject/*
// @match        https://bgm.tv/subject/*
// @match        https://chii.in/subject/*
// @grant        none
// @license      MIT
// @downloadURL  https://update.greasyfork.org/scripts/532719/快速跳转萌娘百科.user.js
// @updateURL    https://update.greasyfork.org/scripts/532719/快速跳转萌娘百科.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOCAL_KEY = 'moegirl_link_template';
    const DEFAULT_TEMPLATE = 'https://zh.moegirl.org.cn/index.php?search={title}';
    const urlTemplate = localStorage.getItem(LOCAL_KEY) || DEFAULT_TEMPLATE;

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

    chineseTitle = chineseTitle.replace(/第.*季/g, '').trim();

    const infobox = document.querySelector('#infobox');
    const firstLi = infobox?.querySelector('li');

    if (infobox && firstLi) {
        const button = document.createElement("button");
        button.textContent = "萌娘百科";
        styleButton(button);

        let pressTimer = null;
        let longPressTriggered = false;

        function startPressTimer() {
            longPressTriggered = false;
            pressTimer = setTimeout(() => {
                longPressTriggered = true;
                const current = localStorage.getItem(LOCAL_KEY) || DEFAULT_TEMPLATE;
                const newTemplate = prompt("请输入跳转链接模板，使用 {title} 表示条目标题：", current);
                if (newTemplate && newTemplate.includes('{title}')) {
                    localStorage.setItem(LOCAL_KEY, newTemplate);
                    alert("✅ 已保存新模板，刷新页面以生效！");
                } else if (newTemplate) {
                    alert("⚠️ 模板格式无效，必须包含 {title} 作为占位符！");
                }
            }, 800);
        }

        function cancelPressTimer() {
            clearTimeout(pressTimer);
        }

        button.addEventListener("mousedown", startPressTimer);
        button.addEventListener("mouseup", cancelPressTimer);
        button.addEventListener("mouseleave", cancelPressTimer);
        button.addEventListener("touchstart", startPressTimer);
        button.addEventListener("touchend", cancelPressTimer);
        button.addEventListener("touchcancel", cancelPressTimer);

        button.addEventListener("click", (e) => {
            if (longPressTriggered) {
                e.preventDefault();
                return;
            }
            const template = localStorage.getItem(LOCAL_KEY) || DEFAULT_TEMPLATE;
            const finalUrl = template.replace(/{title}/g, encodeURIComponent(chineseTitle));
            window.open(finalUrl, "_blank");
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
