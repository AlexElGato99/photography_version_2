"use client";

import { useState, useTransition } from "react";
import type { SectionContact, SiteGeneral } from "@/lib/types/site";
import { submitContact } from "@/app/(site)/actions";

const PinIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const socialIcons: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Behance: (
    <svg viewBox="0 0 24 24">
      <path d="M2 5h6c2 0 3.5 1 3.5 3 0 1.5-1 2.5-2 2.8 1.5.3 2.5 1.5 2.5 3.2 0 2-1.5 3-3.5 3H2zM2 11h6M14 7h6M14 13h7c0-3-2-5-3.5-5S14 10 14 13c0 3 2 4 4 4 1 0 2-.3 2.5-.7" />
    </svg>
  ),
  Pinterest: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v5l-2 9M12 7c1.5 0 3 1 3 3s-1.5 3-3 3" />
    </svg>
  ),
};

export function Contact({
  general,
  meta,
}: {
  general: SiteGeneral;
  meta: SectionContact;
}) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "ok"; msg: string } | { kind: "err"; msg: string }
  >({ kind: "idle" });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    startTransition(async () => {
      const res = await submitContact({
        first_name: String(fd.get("first_name") ?? ""),
        last_name: String(fd.get("last_name") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        service: String(fd.get("service") ?? ""),
        message: String(fd.get("message") ?? ""),
      });
      if (res.ok) {
        setStatus({
          kind: "ok",
          msg: "Thank you — we'll get back to you within 24 hours.",
        });
        form.reset();
      } else {
        setStatus({ kind: "err", msg: res.error });
      }
    });
  };

  return (
    <section className="cn-section cn-contact" id="contact" aria-label="Contact">
      <div className="cn-section-head-center" data-stagger>
        <div className="cn-section-eyebrow">{meta.eyebrow}</div>
        <h2
          className="cn-section-title"
          dangerouslySetInnerHTML={{ __html: meta.title_html }}
        />
        {meta.lead && (
          <p className="cn-section-lead" style={{ margin: "1.5rem auto 0" }}>
            {meta.lead}
          </p>
        )}
      </div>

      <div className="cn-contact-grid">
        <form className="cn-contact-form" onSubmit={onSubmit} data-anim="fade-right">
          <div className="cn-form-row">
            <div className="cn-form-field">
              <label>First name</label>
              <input type="text" name="first_name" placeholder="Your name" required />
            </div>
            <div className="cn-form-field">
              <label>Last name</label>
              <input type="text" name="last_name" placeholder="Your surname" />
            </div>
          </div>
          <div className="cn-form-row">
            <div className="cn-form-field">
              <label>Email</label>
              <input type="email" name="email" placeholder="you@example.com" required />
            </div>
            <div className="cn-form-field">
              <label>Phone</label>
              <input type="tel" name="phone" placeholder="+34 600 000 000" />
            </div>
          </div>
          <div className="cn-form-field">
            <label>Service</label>
            <select name="service" defaultValue={meta.services[0]}>
              {meta.services.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="cn-form-field">
            <label>Tell us about your project</label>
            <textarea name="message" placeholder="Date, location, vision..." />
          </div>
          <button type="submit" className="cn-form-submit" disabled={pending}>
            {pending ? "Sending…" : "Send message"}
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>

          {status.kind === "ok" && (
            <div className="cn-form-status ok">{status.msg}</div>
          )}
          {status.kind === "err" && (
            <div className="cn-form-status err">{status.msg}</div>
          )}
        </form>

        <div className="cn-contact-info-block" data-anim="fade-left">
          <div className="cn-contact-info-item">
            <div className="cn-ci-icon-circle"><PinIcon /></div>
            <div className="cn-ci-text">
              <small>Studio</small>
              <p>{general.address_line}<br />{general.address_city}</p>
            </div>
          </div>
          <div className="cn-contact-info-item">
            <div className="cn-ci-icon-circle"><MailIcon /></div>
            <div className="cn-ci-text">
              <small>Email</small>
              <p>
                <a href={`mailto:${general.contact_email}`}>{general.contact_email}</a>
              </p>
            </div>
          </div>
          <div className="cn-contact-info-item">
            <div className="cn-ci-icon-circle"><PhoneIcon /></div>
            <div className="cn-ci-text">
              <small>Phone</small>
              <p>
                <a href={`tel:${general.contact_phone.replace(/\s/g, "")}`}>
                  {general.contact_phone}
                </a>
              </p>
            </div>
          </div>
          <div className="cn-contact-info-item">
            <div className="cn-ci-icon-circle"><ClockIcon /></div>
            <div className="cn-ci-text">
              <small>Hours</small>
              <p>{general.hours}</p>
            </div>
          </div>
          <div className="cn-contact-social">
            {meta.social.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}>
                {socialIcons[s.label] ?? socialIcons.Instagram}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
