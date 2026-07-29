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
};

function translateText(value: string) {
  let translated = exactTranslations[value.trim()] ?? value;
  translated = translated
    .replace(/^หมวดหมู่:\s*/, "Category: ")
    .replace(/^มีข้อมูล (\d+)\/7 วัน$/, "Data available for $1/7 days")
    .replace(/^อ้างอิงจากโพสต์ล่าสุด (\d+) โพสต์$/, "Based on $1 recent posts")
    .replace(/^กำลังวิเคราะห์เพจหมวด /, "Analyzing Page category: ")
    .replace(/^กำลังจัดทำรายงานล่าสุดของเพจ$/, "Preparing the latest Page report")
    .replace(/^กำลังตรวจข้อมูลล่าสุดของเพจ รายงานเดิมยังใช้งานได้$/, "Refreshing the latest Page data. Your previous report remains available.");
  return translated;
}

function translateElement(element: Element) {
  for (const attribute of ["aria-label", "title"]) {
    const value = element.getAttribute(attribute);
    if (value) element.setAttribute(attribute, translateText(value));
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
      for (const node of textNodes) node.nodeValue = translateText(node.nodeValue ?? "");
      root.querySelectorAll("*").forEach(translateElement);
    };
    translate();
    const observer = new MutationObserver(translate);
    observer.observe(root, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} style={{ display: "contents" }}>{children}</div>;
}
