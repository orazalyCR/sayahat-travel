const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "77001234567";
const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/sayahat_.travel/";

export default function ContactSection() {
  return (
    <section id="contacts" className="bg-ocean-700 py-14 text-white">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">Остались вопросы?</h2>
        <p className="mx-auto mt-2 max-w-xl text-ocean-100">
          Напишите нам — подберём тур под ваш бюджет и даты, ответим в течение 15 минут.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Здравствуйте! Хочу узнать подробнее про туры."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white shadow-sm transition hover:brightness-95 sm:w-auto"
          >
            Написать в WhatsApp
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            Instagram @sayahat_.travel
          </a>
        </div>
      </div>
    </section>
  );
}
