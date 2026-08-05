<p align="center">
  <img src="./docs/landing-page.png" width="900" alt="Grow Together">
</p>
# 🌱 Grow Together

> **แพลตฟอร์มเพื่อการพัฒนาตนเองผ่านการตั้งเป้าหมายและการสนับสนุนจากเพื่อน**

Grow Together เป็นเว็บแอปพลิเคชันที่ช่วยให้ผู้ใช้สามารถตั้งเป้าหมาย ติดตามความก้าวหน้า และได้รับกำลังใจจากเพื่อน เพื่อสร้างแรงจูงใจในการพัฒนาตนเองอย่างต่อเนื่อง

---

## ✨ แนวคิดของโครงงาน

หลายคนเริ่มต้นทำเป้าหมายได้ดี แต่ขาดแรงจูงใจในการทำต่อ

Grow Together จึงถูกพัฒนาขึ้นเพื่อสร้างสภาพแวดล้อมที่ผู้ใช้สามารถ

- 🎯 ตั้งเป้าหมาย
- 📈 ติดตามความก้าวหน้า
- ❤️ ได้รับกำลังใจจากเพื่อน
- 🤝 พัฒนาตนเองไปพร้อมกับชุมชน

โดยเน้นความเรียบง่าย ใช้งานง่าย และไม่มี Social Feed ที่รบกวนสมาธิ

---

# 🚀 ฟีเจอร์หลัก

### 👤 ระบบสมาชิก

- สมัครสมาชิก
- เข้าสู่ระบบ
- เปลี่ยนรหัสผ่าน
- จัดการข้อมูลส่วนตัว

---

### 🎯 ระบบเป้าหมาย

- เพิ่มเป้าหมาย
- แก้ไขเป้าหมาย
- ลบเป้าหมาย
- เช็กอินประจำวัน
- ติดตามความสำเร็จ

---

### 👥 ระบบเพื่อน

- เพิ่มเพื่อน
- ดูเป้าหมายของเพื่อน
- สนับสนุนเป้าหมายของเพื่อน

---

### ❤️ ระบบส่งกำลังใจ

- ส่งกำลังใจได้วันละ 1 ครั้งต่อเป้าหมาย
- นับจำนวนผู้ส่งกำลังใจ
- แสดงผู้ส่งกำลังใจล่าสุด
- แจ้งเตือนเมื่อได้รับกำลังใจ

---

### 👤 โปรไฟล์

- รูปโปรไฟล์
- ชื่อผู้ใช้
- รหัสนักศึกษา
- เปลี่ยนรหัสผ่าน

---

# 🛠 เทคโนโลยีที่ใช้

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion

## Backend

- Supabase Authentication
- Supabase Database
- Row Level Security (RLS)

---

# 🗄 โครงสร้างฐานข้อมูล

ตารางหลัก

- profiles
- goals
- friends
- supports
- daily_checkins

ความสัมพันธ์

```
profiles
   │
   ├── goals
   ├── friends
   └── supports

goals
   ├── daily_checkins
   └── supports
```

---

# 🔒 ความปลอดภัย

- Supabase Authentication
- Row Level Security (RLS)
- Protected Routes
- Password Hashing
- Session Management

---

# 💻 การติดตั้ง

```bash
git clone https://github.com/WeirCNT/Grow-together.git

cd Grow-together

npm install

npm run dev
```

---

# ⚙️ Environment Variables

สร้างไฟล์ `.env`

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

# 🌐 เว็บไซต์

**Live Demo**

https://grow-together-puce.vercel.app

---

# 📸 ตัวอย่างหน้าจอ

> เพิ่มภาพหน้าจอของระบบในภายหลัง

- Landing Page
- Dashboard
- Goals
- Community
- Profile

---

# 🔮 แผนพัฒนาต่อ

- Forgot Password
- ระบบ Badge
- ระบบ Achievement
- Weekly Report
- Mobile Application
- AI Goal Assistant

---

# 👨‍💻 ผู้พัฒนา

**ชนาธิป (Weir)**

โครงงานพัฒนามนุษย์

มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย

---

# 📄 License

MIT License