---
title: "第一天：为什么我要做一个算命App（而我对算命一窍不通）"
date: "2026-01-21"
summary: "盘盘猫开发日记第一天：以零领域知识启动一个中国玄学AI平台。21次commit，monorepo搭建完成，以及一个大胆的假设——AI能否弥补一切知识盲区。"
tags: ["AI", "Software Development"]
series: "盘盘猫开发日记"
part: 1
type: "Post"
status: "Published"
---

今天我推了21个commit。到最后，我搭好了一个包含5个应用、多个共享包的monorepo，以及一个可能真的会变成产品的雏形。不过让我先倒回来，解释一下一个在Airbnb、Apple和AWS做过CTO级别工程师的人，怎么就决定去做中国玄学平台了。

## 那股冲动

在大厂当工程师有一个问题：你会变得非常非常擅长实现别人定义好的需求。你做基础设施，你搞系统扩展，你做影响千万用户的架构决策。但你永远不碰那些最混乱的部分——GTM策略、定价页文案、"为什么我们的转化率是2%而不是4%"这种讨论。那些事，有别人来干。

我已经想体验完整的产品生命周期好几年了。不只是工程。还有产品设计、用户反馈闭环、商业决策。所有环节。全部自己来。没有PM写PRD，没有设计师递Figma稿，没有增长团队帮你搞留存。

所以当我在找一个副项目的时候，我只有一个限制条件：**它必须在一个我完全不懂的领域。**

## 为什么偏偏是中国玄学

我对八字、占星、塔罗、解梦、六壬一无所知。零。我连"日柱"是什么都说不上来，更不知道出生时辰为什么重要。

这正是重点。

我的假设是：**AI能否完全弥补一个领域的知识盲区？** 不是"AI能否帮专家提高效率"——而是一个对某领域零基础的人，能否仅凭AI作为全部知识来源，构建出一个可信、有用的产品？

还有一个现实的角度。中文市场的命理分析需求巨大，但数字化严重不足。现有的大部分应用不是广告农场就是一段话生成器。

## Monorepo搭建

第一个commit："Initial monorepo setup with Turborepo。"把5个现有的Next.js应用移到`apps/`目录下，把共享代码抽成`packages/`。概念上很简单——实际操作时，每一个import路径都会报错，每一处Tailwind配置冲突都会浮出水面。

最终的包结构：

- `packages/api` — AI模型抽象层、SSE流式传输工具

- `packages/auth` — Supabase认证上下文、弹窗、匿名用户处理

- `packages/credits` — 积分扣减、余额检查、费用常量

- `packages/database` — Supabase客户端、生成的类型定义、SQL迁移

- `packages/ui` — 共享组件（AppHeader、Footer、ChatPanel）

- `packages/config` — 统一的Tailwind、ESLint、TypeScript配置

第4步和第5步（修复import、验证构建）占了80%的时间。但这些前期的痛苦，正是后面一切变轻松的原因。

## AI工作流

我把Claude Code作为主要开发工具。不是那种把代码贴进去的聊天机器人——而是一个真正的编码智能体，它能读我的代码库、理解包结构、跨文件做修改、跑测试、反复迭代。

对于领域相关的内容，Claude同时充当研究员和实现者。我问"八字日柱的计算原理是什么？"，得到的不只是解释，而是可运行的TypeScript代码，包含天干地支循环表、五行生克矩阵，甚至夏令时切换的边界情况。

这种感觉很奇妙。我在做一个AI比我更懂业务的产品。AI是领域专家，我是产品经理和架构师。

## 第一天结束

到午夜，monorepo能构建了。5个应用全部跑起来。共享认证正常。Supabase客户端统一了。一次登录，一个积分余额，五个产品。

21次commit。一个monorepo。对算命的了解：零。

## 技术栈

- **Monorepo**：Turborepo

- **框架**：Next.js（App Router）

- **数据库/认证**：Supabase（Postgres + RLS + 实时订阅）

- **AI**：Claude + Gemini — 多模型架构，通过PostHog feature flags控制每个端点

- **样式**：Tailwind CSS，每个应用有独立的design token主题

- **语言**：全栈TypeScript（strict模式，16个包共享类型）

- **部署**：Vercel
