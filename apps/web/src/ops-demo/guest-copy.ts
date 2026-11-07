import { guestCopyLeak, PAYEE_NAME, PAYID_ACCOUNT, PUBLIC_PROFILE_URL } from "./domain";

/** Every sentence the guest can read. The operating system copy stays out of this list. */
export function guestSurfaceStrings(): string[] {
  return [
    "晚棠",
    PAYEE_NAME,
    "悉尼",
    "墨尔本",
    "预约",
    "咨询",
    "周五晚有空。",
    "1 小时",
    "2 小时",
    "过夜",
    "A$600",
    "A$1,100",
    "A$2,400",
    "示例",
    "正在输入…",
    "typing…",
    "想约哪一天？",
    "Which evening?",
    "多久？",
    "How long?",
    "在悉尼还是墨尔本？",
    "Sydney or Melbourne?",
    "去结账",
    "Checkout",
    "我已付款",
    "I've paid",
    "收款户名",
    "Account name",
    "PayID",
    PAYID_ACCOUNT,
    "已解锁，转她私域",
    "Unlocked. Her private channels.",
    "短信",
    "WhatsApp",
    "微信",
    "SMS",
    "WeChat",
    PUBLIC_PROFILE_URL,
    "mrlootbox.com/models/wantang",
    "好。",
    "她看一下到账。",
    "She'll check the transfer.",
  ];
}

export function guestSurfaceIsClean(): boolean {
  return guestSurfaceStrings().every((line) => !guestCopyLeak(line));
}
