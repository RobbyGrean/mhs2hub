<div align="center">

# mhs2hub

### ศูนย์รวมระบบ คู่มือ และเครื่องมือสำหรับงานราชการ

พอร์ทัลแบบ Static Site สำหรับรวมลิงก์ระบบ เอกสาร กระบวนงาน และหน้าสนับสนุนการทำงานไว้ในที่เดียว

[![Open Website](https://img.shields.io/badge/เปิดเว็บไซต์-mhs2hub-ec4899?style=for-the-badge&logo=github)](https://robbygrean.github.io/mhs2hub/)
[![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-22c55e?style=for-the-badge&logo=github)](https://github.com/RobbyGrean/mhs2hub/actions)
[![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JavaScript-7c3aed?style=for-the-badge)](#เทคโนโลยี)

<p>
  <a href="https://robbygrean.github.io/mhs2hub/">ดูเว็บไซต์จริง</a>
  &nbsp;&bull;&nbsp;
  <a href="#ลิงก์สำคัญ">ลิงก์สำคัญ</a>
  &nbsp;&bull;&nbsp;
  <a href="#โครงสร้างโปรเจกต์">โครงสร้างโปรเจกต์</a>
</p>

</div>

---

## ภาพรวม

`mhs2hub` คือหน้า Hub หลักที่ออกแบบมาเพื่อให้ผู้ใช้งานเข้าถึงระบบและเนื้อหาที่เกี่ยวข้องกับงานจัดซื้อจัดจ้างได้รวดเร็วขึ้น โดยรวมทั้งหน้าแนะนำกระบวนงาน เครื่องมือช่วยปฏิบัติงาน เอกสารอ้างอิง สื่อประกอบการนำเสนอ และฐานโปรเจกต์ที่นำไปต่อยอดด้วย AI ไว้ภายใต้เว็บไซต์เดียว

โปรเจกต์นี้ใช้แนวทาง **static-first** จึงเปิดเร็ว ดูแลง่าย และเผยแพร่ผ่าน GitHub Pages ได้โดยไม่ต้องมี backend หรือขั้นตอน build ที่ซับซ้อน

## ลิงก์สำคัญ

| รายการ | เปิดใช้งาน |
|---|---|
| หน้า Hub หลัก | [mhs2hub](https://robbygrean.github.io/mhs2hub/) |
| ฐานโปรเจกต์ที่คุณต่อยอดได้ด้วย AI | [Learning Hub](https://robbygrean.github.io/mhs2hub/learning/) |
| ระบบเช็คชื่อออนไลน์ | [checkin2.html](https://robbygrean.github.io/mhs2hub/checkin2.html) |
| หน้าสำรองระบบเช็คชื่อ | [checkin.html](https://robbygrean.github.io/mhs2hub/checkin.html) |
| โปรแกรมออกเอกสารเบิกเงินเดือน | [jmoney](https://robbygrean.github.io/jmoney/) |
| ภาพรวมการจ้างเหมาบริการผู้ปฏิบัติงานให้ราชการ | [JM Slide](https://robbygrean.github.io/mhs2hub/877go/JMslide/) |
| เนื้อหากระบวนงาน 804 | [804go](https://robbygrean.github.io/mhs2hub/804go/) |

## จุดเด่นของเว็บไซต์

- รวมระบบและคู่มือที่ใช้งานจริงไว้ในหน้าเดียว
- แบ่งหมวดหมู่ตามลักษณะงาน ทำให้ค้นหาหน้าปลายทางได้ง่าย
- มีลิงก์เด่นสำหรับเครื่องมือสำคัญและฟีเจอร์พรีเมียม
- รองรับเนื้อหาแบบคู่มือ สไลด์ เอกสาร และหน้าแสดงผลสำหรับการนำเสนอ
- มี Section **ฐานโปรเจกต์ที่คุณต่อยอดได้ด้วย AI** สำหรับอ่านโครงสร้าง source และนำระบบจริงไปปรับใช้
- มีส่วนพักสมองพร้อมเกมขนาดเล็กและการควบคุมด้วยคีย์บอร์ด
- ใช้ไฟล์ Static จึงเหมาะกับ GitHub Pages และการเปิดใช้งานจากหลายอุปกรณ์

## ตัวอย่างหน้าเว็บไซต์

### Main Portal

หน้าแรกของ Hub ประกอบด้วยหมวดหมู่ระบบ ลิงก์ด่วน สไลด์แนะนำ ฟีเจอร์เสริม และส่วนพักสมอง

![Main Portal Preview](pictureassets/basic1.png)

### JM Slide

หน้าสรุปภาพรวมการจ้างเหมาบริการผู้ปฏิบัติงานให้ราชการ รองรับการอ่านบนเว็บและใช้เป็นสื่อประกอบการนำเสนอ

![JM Slide Preview](877go/JMslide/assets/gallery/pdf-cover.png)

## โครงสร้างโปรเจกต์

```text
mhs2hub/
|- index.html                 # หน้า Hub หลัก
|- style.css                  # สไตล์ของหน้า Hub
|- script.js                  # ฟังก์ชันโต้ตอบและเกมพักสมอง
|- checkin.html
|- checkin2.html
|- checkin-appscript/        # Apps Script และหน้าต่างช่วยงานของระบบเช็คชื่อ
|- Phonebook/                # ระบบสมุดโทรศัพท์หน่วยงาน + Code.gs
|- learning/                 # ศูนย์การเรียนรู้จากโปรเจกต์จริง
|- 804go/                     # เนื้อหากระบวนงาน 804
|- 877go/                     # เนื้อหากระบวนงาน 877
|  |- JMslide/                # ภาพรวมงานจ้างเหมาบริการ
|- JMproject/                 # โปรเจกต์ Static แยกส่วน
|- MHS2Assets/                # ระบบและสื่อด้านทะเบียนทรัพย์สิน
|- inven/                     # ระบบคลังวัสดุสิ้นเปลือง: รับเข้า จ่ายออก ใบเบิก และรายงาน
|- jmfilldata/                # เครื่องมือช่วยจัดการข้อมูล
|- pictureassets/             # ภาพประกอบหน้าเว็บไซต์
|- *.mp3, *.png, *.jpg, ...   # สื่อประกอบและไฟล์ทรัพยากร
```

## โปรเจกต์ภายใน Repo

| Path | หน้าที่ |
|---|---|
| `index.html` | จุดเริ่มต้นของเว็บไซต์และเมนูรวมระบบทั้งหมด |
| `804go/` | เนื้อหาและหน้าประกอบกระบวนงาน 804 |
| `877go/` | เนื้อหากระบวนงานสำหรับหนังสือเวียน 877 |
| `877go/JMslide/` | หน้า Slide สำหรับอธิบายงานจ้างเหมาบริการ |
| `JMproject/` | โปรเจกต์ Static ที่แยกออกจากหน้า Hub หลัก |
| `MHS2Assets/` | หน้าระบบเกี่ยวกับทะเบียนทรัพย์สินและอุปกรณ์ |
| `inven/` | หน้าเว็บระบบคลังวัสดุสิ้นเปลือง: รับเข้า จ่ายออก ใบเบิก Dashboard และรายงาน |
| `jmfilldata/` | หน้าเครื่องมือช่วยงานข้อมูลขนาดเล็ก |
| `Phonebook/` | ระบบสมุดโทรศัพท์หน่วยงาน พร้อม Apps Script backend |
| `checkin-appscript/` | Source Apps Script ของระบบเช็คชื่อออนไลน์ และหน้าต่างสรุป |
| `learning/` | หน้าเรียนรู้โครงสร้างและแนวทางต่อยอดระบบด้วย AI |

## ไฟล์หลัก

### `index.html`

โครงสร้างหน้า Hub หลัก รวมหมวดหมู่ระบบ ลิงก์ภายนอก ปุ่มฟีเจอร์พรีเมียม ส่วนแสดงสไลด์ และส่วนพักสมอง

### `style.css`

กำหนด layout, สี, animation, responsive behavior และ visual style ของหน้า Hub หลัก

### `script.js`

ดูแล slideshow, music playback, touch interaction, keyboard interaction และ logic ของเกมพักสมอง

### `learning/`

ศูนย์การเรียนรู้สำหรับดูระบบจริงเป็นต้นแบบ โดยเชื่อมไปยัง Phonebook, ทะเบียนครุภัณฑ์, jmoney, picturemhs2, PassaduAIagent, ระบบ Inventory และระบบเช็คชื่อออนไลน์

## เรียนรู้การสร้าง Hub แบบ mhs2hub

เริ่มจาก `index.html` ซึ่งทำหน้าที่เป็นจุดรวมทางเข้าสู่ระบบทั้งหมด แล้วใช้ `style.css` ควบคุมรูปแบบการ์ด สี และ responsive layout ส่วน `script.js` ดูแล interaction ที่ใช้ซ้ำในหน้า Hub

แนวทางต่อยอดที่แนะนำ:

1. สร้างการ์ดหรือ Section ใหม่ใน `index.html` และตั้งลิงก์ปลายทางให้ชัดเจน
2. เพิ่ม style แบบ scoped ใน `style.css` เพื่อไม่ให้กระทบส่วนอื่นของหน้า
3. เก็บระบบย่อยไว้เป็นโฟลเดอร์ของตนเอง พร้อม source และคู่มือที่เกี่ยวข้อง
4. ทดสอบ relative path ทั้งจากหน้า Hub และเมื่อเปิดหน้า subproject โดยตรง
5. ใช้ AI ช่วยวิเคราะห์โครงสร้างเดิม ร่างเนื้อหา ตรวจลิงก์ และต่อยอด UI โดยยังตรวจสอบผลกับระบบจริงทุกครั้ง

## เทคโนโลยี

- HTML5
- CSS3
- Vanilla JavaScript
- Static media assets
- GitHub Pages

หน้า Hub หลักไม่มี package manager, bundler หรือ server framework ที่จำเป็นต่อการใช้งาน

## รันในเครื่อง

สามารถเปิด `index.html` โดยตรง หรือใช้ Static Server เพื่อให้เส้นทางไฟล์ทำงานใกล้เคียงสภาพแวดล้อมจริงมากขึ้น

```powershell
python -m http.server 8000
```

จากนั้นเปิด [http://localhost:8000/](http://localhost:8000/)

## การเผยแพร่

การ deploy ใช้ GitHub Pages จาก branch `main`

```text
แก้ไขไฟล์ -> ตรวจสอบลิงก์และ asset -> commit -> push main -> ตรวจสอบ Actions
```

ทุกการ push ไปยัง `main` อาจถูกเผยแพร่ขึ้นเว็บไซต์จริง จึงควรตรวจหน้าและลิงก์ที่เกี่ยวข้องหลัง deployment เสร็จ

## แนวทางแก้ไขที่แนะนำ

- แก้เฉพาะไฟล์ที่เกี่ยวข้องกับ feature นั้น
- ตรวจสอบ relative path ของรูปภาพ เสียง และหน้า subproject ทุกครั้ง
- ระวังการแก้ `index.html`, `style.css` และ `script.js` พร้อมกัน เพราะเป็นแกนหลักของหน้า Hub
- แยก commit ตาม feature เพื่อให้ติดตามและแก้ปัญหาได้ง่าย
- หลัง push ให้ตรวจ GitHub Actions และเปิดเว็บไซต์จริงเพื่อยืนยันผล

## เป้าหมายของโปรเจกต์

เว็บไซต์นี้ถูกสร้างขึ้นเพื่อเป็นศูนย์กลางการทำงานที่ช่วยให้ผู้ใช้งาน:

- เข้าถึงระบบที่ใช้บ่อยได้จากจุดเดียว
- เรียนรู้กระบวนงานผ่านคู่มือและสไลด์ที่เป็นลำดับ
- เปิดเอกสารหรือเครื่องมือเฉพาะงานได้เร็วขึ้น
- ใช้เป็นสื่อประกอบการอธิบายและการฝึกปฏิบัติงาน

## ผู้ดูแล

โดย [RobbyGrean](https://github.com/RobbyGrean)

---

<div align="center">

สร้างเพื่อให้งานที่ซับซ้อน เปิดดูง่ายขึ้น

</div>
