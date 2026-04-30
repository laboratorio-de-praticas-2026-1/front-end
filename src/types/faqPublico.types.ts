import type { FAQItem } from "./faq.types";

export interface FAQPublico extends FAQItem {
    destaque?: boolean;
}