// ==UserScript==
// @name         快速跳转萌娘百科
// @namespace    https://github.com/Zao-chen/Bangumi2Wiki
// @version      2.0.2
// @description  在tab栏中添加跳转萌娘百科按钮。支持条目、人物与角色页面。可以自定义链接。
// @match        https://bangumi.tv/subject/*
// @match        https://bangumi.tv/person/*
// @match        https://bangumi.tv/character/*
// @match        https://bgm.tv/subject/*
// @match        https://bgm.tv/person/*
// @match        https://bgm.tv/character/*
// @match        https://chii.in/subject/*
// @match        https://chii.in/person/*
// @match        https://chii.in/character/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    const LOCAL_KEY = 'moegirl_link_template';
    const DEFAULT_TEMPLATE = 'https://zh.moegirl.org.cn/index.php?search={title}';

    const titleLink = document.querySelector('h1.nameSingle a');

    const isSubjectPage = location.pathname.includes('/subject/');
    const isPersonPage = location.pathname.includes('/person/');
    const isCharacterPage = location.pathname.includes('/character/');
    let displayTitle = null;

    if (isSubjectPage || isPersonPage || isCharacterPage) {
        const tips = document.querySelectorAll('#infobox li span.tip');
        for (const tip of tips) {
            const text = tip.textContent.trim();
            if (isSubjectPage && text.startsWith("中文名")) {
                const li = tip.closest('li');
                if (li) {
                    displayTitle = li.textContent.replace(/^中文名[:：]\s*/, '').trim();
                    break;
                }
            }
            if (isPersonPage && text.startsWith("简体中文名")) {
                const li = tip.closest('li');
                if (li) {
                    displayTitle = li.textContent.replace(/^简体中文名[:：]\s*/, '').trim();
                    break;
                }
            }
            if (isCharacterPage && text.startsWith("简体中文名")) {
                const li = tip.closest('li');
                if (li) {
                    displayTitle = li.textContent.replace(/^简体中文名[:：]\s*/, '').trim();
                    break;
                }
            }
        }
    }

    // fallback：使用主标题本身
    if (!displayTitle) {
        displayTitle = titleLink.textContent.trim();
    }

    // 去除季数，例如“xxx 第1季”
    displayTitle = displayTitle.replace(/第.*季/g, '').trim();

    const navTabs = document.querySelector('.navTabs.clearit') || document.querySelector('.navTabs');
    if (navTabs) {
        const secondTab = navTabs.children[1] || navTabs.firstElementChild;  // 默认插入第二个 <li> 标签（如果存在）
        const newTab = document.createElement("li");
        const link = document.createElement("a");
        link.href = 'javascript:void(0)';
        link.textContent = "萌百";
        link.setAttribute('title', `点击跳转到“${displayTitle}”萌娘百科，长按可设置跳转模板`);  // 设置动态提示文本

        let pressTimer = null;
        let longPressTriggered = false;

        function startPressTimer(e) {
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
            }, 700);
        }

        function cancelPressTimer() {
            clearTimeout(pressTimer);
        }

        link.addEventListener("mousedown", startPressTimer);
        link.addEventListener("mouseup", cancelPressTimer);
        link.addEventListener("mouseleave", cancelPressTimer);
        link.addEventListener("touchstart", startPressTimer);
        link.addEventListener("touchend", cancelPressTimer);
        link.addEventListener("touchcancel", cancelPressTimer);

        link.addEventListener("click", (e) => {
            if (longPressTriggered) {
                e.preventDefault();
                return;
            }
            const template = localStorage.getItem(LOCAL_KEY) || DEFAULT_TEMPLATE;
            const finalUrl = template.replace(/{title}/g, encodeURIComponent(displayTitle));
            window.open(finalUrl, "_blank");
        });

        newTab.appendChild(link);
        navTabs.insertBefore(newTab, secondTab);  // 插入到第二个位置，或者默认插入到第一个元素前
    }

})();
