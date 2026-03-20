# Value Iteration Visualizer 

## 影片


https://github.com/user-attachments/assets/bbcf68f1-bf36-47ab-84b9-54af776df86c



https://github.com/user-attachments/assets/25226794-ec49-4530-9b13-40ca4cad2bfd




一個互動式的 5x5 網格世界 (Grid World) 應用程式，專門用來視覺化強化學習中的 **價值迭代演算法 (Value Iteration Algorithm)**。

本專案使用 Python (Flask) 處理演算法邏輯，並透過 HTML / CSS / JS 打造一個流暢、具現代感 (Glassmorphism) 的互動介面。

## ✨ 特色功能 (Features)

- **自動化最佳路徑推導**：使用價值迭代演算法精確計算出每個狀態（格子）的價值函數 $V(s)$ 與最佳行動政策 (Optimal Policy)。
- **互動式網格設定**：使用者可以在網格上自由點擊，即時設定與更改：
  - 🟢 **起點 (Start Point)**
  - 🏁 **終點 (End Point)**
  - 🚫 **障礙物 (Blocks)**
- **政策變化視覺化**：
  - **Show Random Policy**：在網格上產生隨機箭頭，模擬未受訓練時的隨機政策。
  - **Run Value Iteration**：一鍵執行演算法，格子上會以動畫顯示對應的**價值、最佳箭頭**，並以醒目的黃色標示出從起點直達終點的**最佳軌跡 (Optimal Path)**。

## 🛠️ 技術棧 (Tech Stack)

* **後端 (Backend)**: Python, Flask, NumPy
* **前端 (Frontend)**: 原生 HTML5, Vanilla JavaScript, CSS3 (Glassmorphism 視覺風格)
* **圖標 (Icons)**: FontAwesome

## 🚀 安裝與執行指令 (Installation & Usage)

1. **確保您已安裝 Python 3**
   您可以從 [Python 官網](https://www.python.org/) 下載。

2. **安裝需要的套件**
   開啟終端機 (Terminal / Command Prompt) 並執行：
   ```bash
   pip install flask numpy
   ```

3. **啟動伺服器**
   在專案的根目錄 `value_iteration_app` 底下執行主程式：
   ```bash
   python app.py
   ```

4. **開啟瀏覽器**
   在瀏覽器網址列輸入以下網址即可開始使用：
   [http://127.0.0.1:5000](http://127.0.0.1:5000)

## 📐 演算法規則 (Algorithm Rules)

- 網格預設大小為 `5x5`。
- 每次移動 (Up, Down, Left, Right) 的步驟成本為 `-1`。
- 抵達終點的獎勵為 `+10`（或視為吸收狀態）。
- 若移動方向撞上網格邊緣或指定的障礙物，智慧體 (Agent) 將會留在原地的狀態。
- $\gamma$ (Discount Factor) 預設為 `0.9`。 
- 收斂條件：當所有狀態的價值更新差異 ($\Delta$) 小於 `1e-4` 時視為收斂。

## 📄 授權 (License)

This project is licensed under the MIT License.
