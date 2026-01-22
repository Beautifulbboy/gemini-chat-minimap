function initMinimap() {
    // 1. 防止重复创建容器
    if (document.getElementById('gemini-minimap-container')) return;

    // 2. 创建 Minimap 主容器
    const minimap = document.createElement('div');
    minimap.id = 'gemini-minimap-container';
    document.body.appendChild(minimap);

    // 3. 创建预览浮窗 (Preview Card)
    const previewCard = document.createElement('div');
    previewCard.id = 'gemini-minimap-preview';
    document.body.appendChild(previewCard);

    // 核心更新逻辑
    const updateMinimap = () => {
        minimap.innerHTML = ''; 

        // 查找对话块 (选择器策略保持不变，如果不准需要调整这里)
        const messageBlocks = document.querySelectorAll('user-query, model-response');

        messageBlocks.forEach((block) => {
            const isUser = block.tagName.toLowerCase() === 'user-query';
            // 提取文本，移除多余换行
            const rawText = block.innerText || "";
            const cleanText = rawText.replace(/\s+/g, ' ').trim(); 

            // 如果没有内容，跳过
            if (cleanText.length === 0) return;

            // 创建 Minimap 色块
            const mapItem = document.createElement('div');
            mapItem.className = `minimap-item ${isUser ? 'minimap-user' : 'minimap-model'}`;
            
            // 计算高度 (加一点权重，让短对话也能看清)
            const height = Math.min(Math.max(rawText.length / 150, 6), 60); 
            mapItem.style.height = `${height}px`;

            // --- 鼠标交互事件 ---

            // 1. 点击跳转 (修正版：兼容内部滚动容器)
            mapItem.addEventListener('click', () => {
                // 找到最近的可以滚动的祖先元素
                const getScrollParent = (node) => {
                    if (node == null) return null;
                    if (node.scrollHeight > node.clientHeight) {
                        return node;
                    } else {
                        return getScrollParent(node.parentNode);
                    }
                };

                const scrollParent = getScrollParent(block);

                if (scrollParent && scrollParent !== document.body) {
                    // 如果是在内部容器滚动 (Gemini 的常见情况)
                    const targetOffsetTop = block.offsetTop;
                    const containerOffset = 40; // 预留顶部距离
                    
                    scrollParent.scrollTo({
                        top: targetOffsetTop - containerOffset,
                        behavior: 'smooth'
                    });
                } else {
                    // 如果是在 window 滚动 (备选方案)
                    const offset = 70;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = block.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    
                    window.scrollTo({
                        top: elementPosition - offset,
                        behavior: 'smooth'
                    });
                }
            });

            // 2. 鼠标移入：显示预览
            mapItem.addEventListener('mouseenter', () => {
                // 获取当前色块在屏幕的位置
                const rect = mapItem.getBoundingClientRect();
                
                // 设置预览内容
                const roleText = isUser ? "我 (User)" : "Gemini (Model)";
                const previewText = cleanText.length > 180 ? cleanText.substring(0, 180) + "..." : cleanText;
                
                previewCard.innerHTML = `<strong>${roleText}</strong>${previewText}`;
                
                // 设置样式区分
                previewCard.style.borderLeftColor = isUser ? '#4285f4' : '#34a853';

                // 计算位置：让预览框的中心对齐色块的中心
                // 但要防止超出屏幕底部
                let topPos = rect.top - 20; 
                // 简单的边界检查 (防止显示到屏幕外)
                if (topPos + previewCard.offsetHeight > window.innerHeight) {
                    topPos = window.innerHeight - previewCard.offsetHeight - 10;
                }
                
                previewCard.style.top = `${topPos}px`;
                previewCard.style.display = 'block';
            });

            // 3. 鼠标移出：隐藏预览
            mapItem.addEventListener('mouseleave', () => {
                previewCard.style.display = 'none';
            });

            minimap.appendChild(mapItem);
        });
    };

    // 延时启动 + 监听变化
    setTimeout(updateMinimap, 2000);

    const observer = new MutationObserver((mutations) => {
        clearTimeout(window.refreshTimer);
        window.refreshTimer = setTimeout(updateMinimap, 1000);
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener('load', initMinimap);
// 路由兜底
setInterval(() => {
    if (!document.getElementById('gemini-minimap-container')) {
        initMinimap();
    }
}, 3000);