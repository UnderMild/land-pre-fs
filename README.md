# Land Pre-FS (Modern Stack)

โปรเจควิเคราะห์ความเป็นไปได้ทางการเงินเบื้องต้นสำหรับโครงการจัดสรรที่ดิน (Real Estate Feasibility) ที่ได้รับการพัฒนาใหม่จากเวอร์ชัน Single HTML ให้กลายเป็น Modern Web Application โดยใช้ Next.js 15 และ React 19

## 🚀 Key Features

- **Advanced Land Calculation:** รองรับการคำนวณพื้นที่ดินแบบไทย (ไร่-งาน-วา) และแปลงเป็น ตร.ม. อัตโนมัติ
- **Two-way Financial Solver:** ระบบคำนวณย้อนกลับอัจฉริยะ สามารถเลือกคำนวณหา (1) ราคาขายที่ควรตั้ง, (2) ราคาที่ดินที่สู้ไหว หรือ (3) ค่าก่อสร้างที่เหมาะสม ตามเป้าหมายกำไร (Target GM)
- **Flexible Sensitivity Lab:** กราฟวิเคราะห์ความอ่อนไหวที่ปรับเปลี่ยนแกน X และ Y ได้อย่างอิสระ (เช่น ดูผลกระทบของราคาที่ดินต่อกำไรสุทธิ หรือราคาขายที่ต้องตั้ง)
- **URL Sync Engine:** บันทึกค่าที่กรอกไว้ใน URL อัตโนมัติ ทำให้สามารถ Copy ลิงก์เพื่อแชร์ผลการคำนวณให้ผู้อื่นได้ทันทีโดยไม่ต้องผ่าน Database
- **Modern Dashboard:** แสดงผล KPI สำคัญ (GFA, NSA, Project Value) และสรุปงบประมาณโครงการ (Financial Summary)

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Type-safe logic)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Validation:** [Zod](https://zod.dev/)

---

## 📝 คำแนะนำสำหรับขั้นตอนถัดไปใน Cursor

เพื่อให้โปรเจคนี้พร้อมใช้งานจริงและ Deploy ได้อย่างราบรื่น แนะนำให้ดำเนินการต่อดังนี้ครับ:

### 1. การเตรียมสภาพแวดล้อม (Local Setup)
เปิดโฟลเดอร์ `land-pre-fs` ใน Cursor แล้วรันคำสั่ง:
```bash
npm install
```

### 2. ตรวจสอบความเรียบร้อย (Build Check)
ก่อน Push ขึ้น GitHub แนะนำให้ลองรันคำสั่ง Build เพื่อเช็คว่าไม่มี Error ของ TypeScript หรือ Linting:
```bash
npm run build
```

### 3. การใช้งาน Git & GitHub
1.  Initialize Git: `git init`
2.  Add all files: `git add .` (Cursor มี UI ให้กดยืนยันได้ง่าย)
3.  Commit: `git commit -m "Initial migration to Modern Stack"`
4.  สร้าง Repository บน GitHub และทำการ `git push`

### 4. การ Deploy บน Vercel
1.  ไปที่ [Vercel Dashboard](https://vercel.com/)
2.  เลือก "Add New" -> "Project"
3.  Import repository จาก GitHub
4.  Vercel จะตรวจพบว่าเป็น Next.js อัตโนมัติ ให้กด **Deploy** ได้เลย

### 5. การพัฒนาต่อยอด (Future Ideas)
- **Export to PDF/Excel:** เพิ่มระบบดาวน์โหลดรายงานสรุป
- **User Authentication:** ระบบสมาชิกสำหรับเซฟโปรเจคไว้ใน Database (ถ้าต้องการ)
- **Dark Mode:** เพิ่มการรองรับธีมมืดผ่าน Tailwind v4

---
**Land Pre-FS** • พัฒนาจากหัวใจเพื่อนักพัฒนาอสังหาริมทรัพย์
