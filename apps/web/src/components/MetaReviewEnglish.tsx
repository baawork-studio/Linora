import { type ReactNode, useEffect, useRef } from "react";

const exactTranslations: Record<string, string> = {
  "กรุณารอสักครู่": "Please wait",
  "กำลังเปิดหน้าให้คุณ": "Loading your page",
  "กำลังพาไปเลือกเพจ Facebook": "Taking you to choose a Facebook Page",
  "กำลังเปิด Facebook": "Opening Facebook",
  "ไปเลือก Page": "Choose a Page",
  "เข้าสู่ระบบด้วย Facebook": "Continue with Facebook",
  "ยินดีต้อนรับสู่ Linora": "Welcome to Linora",
  "เริ่มวิเคราะห์เพจ Facebook ของคุณได้ในไม่กี่ขั้นตอน": "Start analyzing your Facebook Page in a few simple steps.",
  "ทำไม Linora จึงขอเชื่อมต่อ Facebook": "Why Linora requests Facebook access",
  "เลือกเพจ Facebook": "Choose a Facebook Page",
  "เลือกเพจที่ต้องการให้ Linora วิเคราะห์": "Select the Page Linora should analyze.",
  "ใช้ข้อมูลเฉพาะเพจที่คุณเลือก": "Data is used only from the Page you select",
  "เพจที่พร้อมเชื่อมต่อ": "Available Page",
  "เลือกเพจนี้": "Select this Page",
  "เลือกเพจนี้แล้ว": "Page selected",
  "ยืนยันก่อนอนุญาต": "Confirm before continuing",
  "กำลังเปิดหน้าวิเคราะห์": "Opening analytics",
  "อนุญาตและเข้าสู่หน้าวิเคราะห์": "Authorize and open analytics",
  "กำลังวิเคราะห์เพจ": "Analyzing your Page",
  "กำลังเตรียมรายงานของเพจ": "Preparing your Page report",
  "ภาพรวมเพจ": "Page overview",
  "คะแนนประเมินของ Linora": "Linora assessment score",
  "คอมเมนต์สำคัญ": "Important comments",
  "เวลาโพสต์ที่ดีที่สุด": "Best time to post",
  "คำแนะนำจาก Linora": "Recommendations from Linora",
  "รายงานล่าสุด": "Latest report",
  "รายงาน 7 วันล่าสุด": "Latest 7-day report",
  "เปลี่ยนเพจ Facebook": "Change Facebook Page",
  "การจัดการข้อมูลและสิทธิ์": "Data and permissions",
  "ยกเลิกการเชื่อมต่อ Facebook": "Disconnect Facebook",
  "ลบข้อมูล Linora": "Delete Linora data",
  "อนุญาตแล้ว": "Authorized",
  "ดีมาก": "Excellent",
  "ดี": "Good",
  "ควรปรับปรุง": "Needs improvement",
  "ต้องดูแลเร่งด่วน": "Needs attention",
  "ดีที่สุด": "Best",
  "กำลังโหลดช่วงรายงาน": "Loading report period",
  "ยังไม่มีข้อมูลรายวัน": "No daily data yet",
  "ยังไม่มีข้อมูล": "No data yet",
  "กำลังโหลด": "Loading",
  "ความเป็นส่วนตัว": "Privacy",
  "เงื่อนไข": "Terms",
  "ลบข้อมูล": "Delete data",
  "กำลังเปิดหน้าอนุญาตจาก Facebook": "Opening Facebook authorization",
  "ไม่สามารถเชื่อมต่อและวิเคราะห์เพจได้ กรุณาลองอีกครั้ง": "Unable to connect and analyze this Page. Please try again.",
  "เราจะอ่านรายชื่อเพจ Facebook ที่คุณจัดการ และใช้ข้อมูลจากเพจที่คุณเลือกเพื่อจัดทำรายงานเท่านั้น": "We read the Facebook Pages you manage and use data from the Page you select only to create your report.",
  "Linora จะไม่ขอรหัสผ่าน Facebook ไม่แสดงข้อมูลการเชื่อมต่อในหน้าเว็บ และไม่โพสต์หรือตอบกลับแทนคุณโดยอัตโนมัติ": "Linora never asks for your Facebook password, displays no connection credentials, and does not post or reply on your behalf automatically.",
  "Linora จะใช้ข้อมูลเพจ การมีส่วนร่วม และความคิดเห็นที่จำเป็นเพื่อจัดทำรายงานเท่านั้น คุณสามารถเปลี่ยนเพจหรือยกเลิกการเชื่อมต่อได้ภายหลัง": "Linora uses the selected Page's content, engagement, and relevant comments only to prepare reports. You can change Pages or disconnect later.",
  "ฉันเป็นผู้ดูแลหรือมีสิทธิ์จัดการเพจนี้ และอนุญาตให้ Linora วิเคราะห์ข้อมูลของเพจที่เลือก": "I manage this Page or have permission to manage it, and I authorize Linora to analyze the selected Page.",
  "Linora จะไม่โพสต์ ตอบกลับ หรือแก้ไขเพจที่เลือกโดยอัตโนมัติ": "Linora will not post, reply to, or edit the selected Page automatically.",
  "ยังวิเคราะห์เพจไม่สำเร็จ": "Page analysis has not completed",
  "ไม่สามารถยืนยันการเข้าใช้งานได้": "Unable to verify access",
  "ไม่พบเพจ Facebook ที่คุณมีสิทธิ์จัดการ": "No Facebook Pages you can manage were found",
  "ไม่สามารถรับข้อมูลเพจ Facebook ได้ กรุณาลองใหม่อีกครั้ง": "Unable to retrieve Facebook Page data. Please try again.",
  "กำลังตรวจสอบการเข้าใช้งานผ่าน LINE": "Preparing your secure session",
  "ไม่สามารถเปิดลิงก์สำหรับการตรวจสอบได้": "This review link is unavailable",
  "กำลังดึงข้อมูลโพสต์ ตรวจคอมเมนต์ และเตรียมผลลัพธ์สำหรับ LINE": "Retrieving posts, reviewing comments, and preparing analysis results.",
  "การเข้าถึง": "Reach",
  "การมีส่วนร่วม": "Engagement",
  "กำลังตรวจสอบเวลาอัปเดต": "Checking the update time",
  "วิเคราะห์เพจอีกครั้งเพื่อคำนวณจากโพสต์จริง": "Run another analysis to calculate this from actual posts.",
  "อ่านแนวโน้ม": "Trend insight",
  "แนะนำให้ลอง": "Try this",
  "ยังไม่มีคำแนะนำจาก AI ในขณะนี้": "No AI recommendation is available yet.",
  "ควรสะสมข้อมูลอย่างน้อย 3 โพสต์ก่อน เพื่อให้คำแนะนำมีความน่าเชื่อถือ": "Collect data from at least 3 posts before relying on this recommendation.",
  "แนวทางคอนเทนต์ที่ควรลอง": "Content ideas to try",
  "Linora กำลังเตรียมคำแนะนำจากข้อมูลเพจล่าสุดให้ค่ะ": "Linora is preparing recommendations from the latest Page data.",
  "อ้างอิงจากโพสต์เด่น": "Based on a top post",
  "อัปเดตการวิเคราะห์ล่าสุด": "Latest analysis update",
  "คุณสามารถยกเลิกการเชื่อมต่อหรือลบข้อมูล Linora ได้ทุกเมื่อ การลบข้อมูลจะนำเพจที่เลือกและสิทธิ์ที่อนุญาตออกจากเบราว์เซอร์นี้": "You can disconnect Facebook or delete Linora data at any time. Deleting data removes the selected Page and granted permissions from this browser.",
  "ดำเนินการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง": "The action could not be completed. Please try again.",
  "ลบข้อมูล Page, รายงาน และตัวเลขวิเคราะห์ทั้งหมดของ Linora ใช่หรือไม่?": "Delete this Page connection, its reports, and all saved Linora analytics data?",
  "Linora ใช้ข้อมูลจากเพจที่เลือกเท่านั้น และจะไม่โพสต์แทนคุณโดยอัตโนมัติ": "Linora uses data from the selected Page only and never posts on your behalf automatically.",
  "กำลังจัดทำรายงานล่าสุดของเพจ": "Preparing the latest Page report",
  "กำลังตรวจข้อมูลล่าสุดของเพจ รายงานเดิมยังใช้งานได้": "Refreshing the latest Page data. Your previous report remains available.",
};

function translateText(value: string) {
  let translated = exactTranslations[value.trim()] ?? value;
  translated = translated
    .replace(/^หมวดหมู่:\s*/, "Category: ")
    .replace(/^มีข้อมูล (\d+)\/7 วัน$/, "Data available for $1/7 days")
    .replace(/^อ้างอิงจากโพสต์ล่าสุด (\d+) โพสต์$/, "Based on $1 recent posts")
    .replace(/^อิงจาก (\d+) โพสต์ล่าสุด และปฏิสัมพันธ์ ([\d,.-]+) ครั้ง$/, "Based on $1 recent posts and $2 engagements")
    .replace(/^กำลังอ่านข้อมูลล่าสุดของ (.+) เพื่อจัดทำรายงานให้คุณ$/, "Reading the latest data from $1 to prepare your report")
    .replace(/^Linora จะลองอัปเดตข้อมูลของ (.+) อีกครั้งในไม่ช้า$/, "Linora will try to update $1 again shortly")
    .replace(/^กำลังวิเคราะห์เพจหมวด /, "Analyzing Page category: ")
    .replace(/\bมกราคม\b/g, "January").replace(/\bกุมภาพันธ์\b/g, "February").replace(/\bมีนาคม\b/g, "March")
    .replace(/\bเมษายน\b/g, "April").replace(/\bพฤษภาคม\b/g, "May").replace(/\bมิถุนายน\b/g, "June")
    .replace(/\bกรกฎาคม\b/g, "July").replace(/\bสิงหาคม\b/g, "August").replace(/\bกันยายน\b/g, "September")
    .replace(/\bตุลาคม\b/g, "October").replace(/\bพฤศจิกายน\b/g, "November").replace(/\bธันวาคม\b/g, "December")
    .replace(/ เวลา /g, " at ").replace(/ น\.$/, "");
  return translated;
}

function translateElement(element: Element) {
  for (const attribute of ["aria-label", "title"]) {
    const value = element.getAttribute(attribute);
    if (!value) continue;
    const translated = translateText(value);
    if (translated !== value) element.setAttribute(attribute, translated);
  }
}

export function MetaReviewEnglish({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const translate = () => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
      for (const node of textNodes) {
        const current = node.nodeValue ?? "";
        const translated = translateText(current);
        if (translated !== current) node.nodeValue = translated;
      }
      root.querySelectorAll("*").forEach(translateElement);
    };
    translate();
    const observer = new MutationObserver(translate);
    observer.observe(root, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} style={{ display: "contents" }}>{children}</div>;
}
