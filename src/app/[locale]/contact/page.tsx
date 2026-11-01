import { getTranslations, setRequestLocale } from "next-intl/server";
import { Phone, MapPin, Instagram } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { ContactForm } from "./contact-form";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  const info = [
    {
      icon: Phone,
      label: t("phoneLabel"),
      value: t("phoneValue"),
      href: "tel:+863168321001",
    },
    {
      icon: MapPin,
      label: t("addressLabel"),
      value: t("addressValue"),
      href: undefined,
    },
    {
      icon: Instagram,
      label: t("instagramLabel"),
      value: t("instagramValue"),
      href: "https://www.instagram.com/sinours.art/",
    },
  ];

  return (
    <div className="container-content py-16 md:py-24">
      <header className="mb-16 max-w-2xl">
        <h1 className="text-display-lg font-bold">{t("title")}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{t("subtitle")}</p>
      </header>

      <div className="grid gap-16 md:grid-cols-2">
        {/* Contact info */}
        <section>
          <h2 className="text-2xl font-bold">{t("enterpriseTitle")}</h2>
          <ul className="mt-8 space-y-6">
            {info.map((item) => (
              <li key={item.label} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border">
                  <item.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="eyebrow">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-1 inline-block text-base link-underline"
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-base">{item.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Form */}
        <section>
          <h2 className="text-2xl font-bold">{t("formTitle")}</h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
