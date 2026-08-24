import {
  BookOpen,
  Send,
  MessageCircle,
  Info,
  User,
  Mail,
  Home,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

export const DRAWER_LINKS = {
  joinTelegram: "https://t.me/+1YqS8Bxcj5M4OTk1",
  whatsappChannel: "https://whatsapp.com/channel/0029VbCvhNqGZNCp0sKLUk3G",
  devTelegram: "https://t.me/Liee070",
  devInstagram: "https://www.instagram.com/ansh_u_keshawat?igsh=dXF0NDQ5NGh5cWVs",
};

export const mainMenu: MenuItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Study", href: "/study/batches", icon: GraduationCap },
];

export const socialMenu: MenuItem[] = [
  { label: "Join Telegram", href: DRAWER_LINKS.joinTelegram, icon: Send, external: true },
  { label: "WhatsApp Channel", href: DRAWER_LINKS.whatsappChannel, icon: MessageCircle, external: true },
];

export const aboutMenu: MenuItem[] = [
  { label: "About Developer", href: DRAWER_LINKS.devTelegram, icon: User, external: true },
  { label: "About Us", href: "/about", icon: Info },
  { label: "Contact Us", href: "/contact", icon: Mail },
];
