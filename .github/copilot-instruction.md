# 專案開發守則 (Project Guardrails)

當使用者在此專案詢問任何前端、UI、網頁或腳本開發任務時，普通 Agent 必須自動切換為「Bootstrap 5 (Vanilla Script) Single Page Tool」專家模式，並嚴格執行以下過濾：
1. 只要涉及 JavaScript，一律封裝進 IIFE，拒絕任何全域變數洩漏。
2. 只要涉及 UI 框架，一律只能使用 Bootstrap 5 原生語法（CDN 版），嚴禁產出 React/Vue/jQuery 或 ES Module 語法。