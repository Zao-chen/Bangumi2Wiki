// ==UserScript==
// @name         萌娘百科添加班固米搜索按钮
// @namespace    https://github.com/Zao-chen/Bangumi2Wiki
// @version      1.1
// @description  在萌娘百科页面导航栏添加班固米(Bangumi)搜索按钮
// @match        https://zh.moegirl.org.cn/*
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加自定义样式
    GM_addStyle(`
        .bangumi-link {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
            color: white !important;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        .bangumi-link:hover {
            opacity: 0.85;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
        }
    `);
    
    // 等待页面加载完成
    function addBangumiButton() {
        // 查找目标 ul 元素
        const namespacesList = document.querySelector('ul.namespaces-links-list.flex');
        
        if (namespacesList) {
            // 获取当前页面名称（从URL中提取并解码）
            const currentPath = window.location.pathname;
            let pageName = currentPath.replace(/^\//, ''); // 移除开头的 /
            
            // 解码URL中的中文字符
            try {
                pageName = decodeURIComponent(pageName);
            } catch (e) {
                console.error('解码URL失败:', e);
            }
            
            // 如果是首页或特殊页面，不添加按钮
            if (!pageName || pageName === 'Mainpage' || pageName.startsWith('index.php')) {
                return;
            }
            
            // 创建新的 li 元素
            const newLi = document.createElement('li');
            newLi.setAttribute('data-v-606f23e7', '');
            newLi.className = 'flex-1';
            
            // 创建 a 元素
            const newLink = document.createElement('a');
            newLink.setAttribute('data-v-606f23e7', '');
            // Bangumi的搜索URL需要对中文进行编码
            newLink.href = `https://bgm.tv/subject_search/${encodeURIComponent(pageName)}`;
            newLink.textContent = '班固米';
            newLink.title = `在 Bangumi 搜索「${pageName}」`;
            newLink.target = '_blank'; // 在新标签页打开
            newLink.className = 'bangumi-link'; // 添加自定义样式类
            
            // 组装并添加到列表
            newLi.appendChild(newLink);
            namespacesList.appendChild(newLi);
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addBangumiButton);
    } else {
        addBangumiButton();
    }
})();
