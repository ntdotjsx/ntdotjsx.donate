import UserDashborad from "./views/modules/user_dashboard";
import AdminDashborad from "./views/modules/admin_dashboard";
import Account from "./views/modules/account";
import Icons from "./config.icon";

export const NavbarLink = [
    { name: "วิธีใช้งาน", href: "/", current: true },
    { name: "ติดต่อ", href: "https://ntdotjsx.web.app", current: false },
];

export const UserMap = [
    {
        title: "หน้าจัดการ",
        subtitle: "Dashboard",
        element: <UserDashborad/>
    },
    {
        title: "บัญชีผู้ใช้",
        subtitle: "Account",
        element: <Account/>
    },
];

export const AdminMap = [
    {
        title: "หน้าจัดการ",
        subtitle: "Dashboard",
        element: <AdminDashborad/>
    },
    {
        title: "บัญชีผู้ใช้",
        subtitle: "Account",
        element: <Account/>
    },
];

export const Feature = [
    {
        icon: Icons.Pay,
        name: "Pay",
        detail: "รับเงินโดเนทเข้าบัญชีโดยตรง ไม่ต้องผ่านตัวกลาง",
        verify: ["รองรับ TrueMoney Wallet", "รองรับ PromptPay ทุกธนาคาร"],
    },
    {
        icon: Icons.Manage,
        name: "Manage",
        detail: "จัดการและวิเคราะห์การรับเงินโดเนทได้ง่าย ผ่านแดชบอร์ดที่ใช้งานง่าย",
        verify: ["ปรับแต่งหน้ารับเงินได้ตามต้องการ", "ดูสถิติและวิเคราะห์ข้อมูลแบบเรียลไทม์"],
    },
    {
        icon: Icons.Secure,
        name: "Secure",
        detail: "ระบบความปลอดภัยมาตรฐานสากล พัฒนาโดยทีมผู้เชี่ยวชาญ",
        verify: ["ระบบความปลอดภัยมาตรฐานสากล", "ทีมซัพพอร์ตพร้อมช่วยเหลือ 24 ชั่วโมง"],
    },
];
