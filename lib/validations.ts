import { z } from "zod";

// Базовая схема полей тура. .refine() возвращает ZodEffects, у которого нет
// .partial(), поэтому саму проверку дат даты оборачиваем отдельно для create/update.
const tourBaseSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа").max(200),
  shortDescription: z.string().min(10, "Минимум 10 символов").max(300),
  description: z.string().min(10, "Минимум 10 символов"),
  country: z.string().min(2),
  city: z.string().optional().nullable(),
  price: z.coerce.number().positive("Цена должна быть больше 0"),
  oldPrice: z.coerce.number().positive().optional().nullable(),
  currency: z.string().default("KZT"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  durationDays: z.coerce.number().int().positive(),
  imageUrl: z.string().url("Укажите корректный URL картинки"),
  galleryUrls: z.array(z.string().url()).optional().default([]),
  isHot: z.coerce.boolean().optional().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional().default("DRAFT"),
  whatsappOverride: z.string().optional().nullable(),
});

const datesInOrder = (data: { startDate: Date; endDate: Date }) => data.endDate >= data.startDate;
const dateOrderIssue = {
  message: "Дата окончания не может быть раньше даты начала",
  path: ["endDate"] as const,
};

// Используется при создании тура — обязательные поля + проверка дат.
export const tourSchema = tourBaseSchema.refine(datesInOrder, dateOrderIssue);

// Используется при обновлении — все поля необязательны; проверка дат срабатывает,
// только если в запросе присутствуют обе даты.
export const tourUpdateSchema = tourBaseSchema.partial().refine(
  (data) => (data.startDate && data.endDate ? datesInOrder(data as { startDate: Date; endDate: Date }) : true),
  dateOrderIssue
);

export type TourInput = z.infer<typeof tourSchema>;

export function slugify(title: string): string {
  const translitMap: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };

  return title
    .toLowerCase()
    .split("")
    .map((ch) => translitMap[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
