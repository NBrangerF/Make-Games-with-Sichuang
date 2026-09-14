# 原创项目资产

五手势 SVG、三能力分层舞台、主题配色、封面构图和程序化声音由本项目使用 Codex 制作，基于用户已确认的「规则试验场 v0.6」概念方向。手形重新绘制为可编辑路径，未裁切概念图；声音由数学模型合成，无外部录音、采样或第三方音效输入。它们作为本项目交付内容提供给用户使用、修改与发行。

通用 UI 图标来自 Lucide，按旁边完整 ISC/MIT 许可证保留作者与授权。

- 可编辑手形：`art-source/gestures/paths.json` 与 5 个 SVG。
- 分层舞台几何：`src/presentation/stage-paths.ts`；8 个 SVG 可在 Inkscape、Figma 等矢量工具打开。
- 音频可复现源码：`art-source/audio/generate.py`。
- 音频母版：`art-source/audio/masters/{paper,electronic}`，48 kHz / 24-bit / mono WAV。
- 浏览器发行声音：`public/assets/audio`，48 kHz / 16-bit / mono WAV。
- 完整文件映射：`art-source/assets-manifest.json`。

项目概念源文件位于原 v0.6 方案路径；本交付不再分发这些生成位图，也不将它们作为当前游戏UI使用。
