Gemini Chat Minimap
为一个增强 Gemini (Google AI) 聊天体验的浏览器扩展程序。它在页面右侧添加了一个类似 VS Code Minimap 的交互式导航条，帮助用户在长对话中快速定位、预览和跳转。

🌟 核心功能
可视化对话流：在右侧展示整个对话的缩略图，蓝色块代表用户提问，绿色块代表 Gemini 回答。

交互式预览：鼠标悬停在缩略块上时，左侧会弹出悬浮卡片，展示该段对话的文字摘要。

智能遮罩指示器：一个半透明的蓝色遮罩会实时追踪你当前阅读的对话组（提问+回答），提供极佳的视觉反馈。

精准一键跳转：点击缩略块，页面将平滑滚动至对应位置，并自动预留顶部边距以避开导航栏。

高性能渲染：采用增量更新逻辑，仅在对话数量变化时触发重绘，彻底解决页面闪烁问题。

沉浸式设计：支持背景模糊（Backdrop Filter）和鼠标穿透，不干扰正常的网页操作。

🛠️ 安装步骤
下载代码：将 manifest.json, content.js, 和 styles.css 保存在同一个文件夹中。

打开扩展程序页面：在 Chrome 浏览器地址栏输入 chrome://extensions/。

启用开发者模式：点击右上角的“开发者模式”开关。

加载插件：点击“加载已解压的扩展程序”，选择包含上述文件的文件夹。

开始使用：刷新 Gemini 页面即可看到右侧的 Minimap。

📂 文件说明
manifest.json: 扩展配置文件，定义了插件的运行权限和作用域（仅限 gemini.google.com）。

content.js: 核心逻辑脚本。

包含 MutationObserver 监听对话变化。

实现了基于 elementFromPoint 的智能视口追踪算法。

处理平滑滚动及自定义偏移量逻辑。

styles.css: 视觉样式表。

定义了 Minimap 的磨砂玻璃效果。

实现了遮罩指示器的光晕（Box-shadow）及对比度增强效果。

🔧 自定义调节
如果你想根据自己的喜好进一步微调，可以修改以下参数：

顶部间距：修改 content.js 中的 containerOffset (当前为 20) 或 offset (当前为 70) 来调整跳转后的位置。

Minimap 位置：修改 styles.css 中 #gemini-minimap-container 的 top 值 (当前为 80px)。

预览字数：修改 content.js 中 substring(0, 180) 的数值。
