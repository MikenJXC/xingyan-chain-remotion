# 星研链 40 秒产品视频

一个使用 Remotion、Three.js 和 React Three Fiber 制作的 40 秒科研智能体产品展示视频。

## 规格

- 1920 × 1080
- 30 FPS
- 40 秒
- H.264 MP4
- 三维连续镜头、程序化动画与人声同步字幕

## 本地运行

```bash
npm install
npm run studio
```

## 渲染

```bash
npm run render
```

项目不会提交本地人声、背景音乐或渲染产物。渲染人声版本前，请将自备音频放到：

```text
public/audio/xingyan-voiceover-40s.wav
```

音频规格建议为 48 kHz、双声道、40 秒。

## 结构

- `src/XingYanChainVideoV3.tsx`：主要三维场景、动画和字幕时间轴
- `src/Root.tsx`：Remotion Composition 配置
- `docs/`：连续叙事稿、制作提示词和物体因果表
- `scripts/`：音频生成辅助脚本

