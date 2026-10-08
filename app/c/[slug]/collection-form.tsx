"use client";

import React, { useState, useRef } from "react";
import { submitTestimonial, uploadAvatar } from "./actions";
import { compressAvatar } from "@/lib/image-compress";

interface FormRow {
  id: string;
  name?: string;
  user_id: string;
  headline?: string;
  prompt?: string;
  thank_you_message: string;
  theme_color: string;
  collect_photo?: boolean;
  collect_rating: boolean;
  require_consent: boolean;
  custom_css?: string | null;
}

interface FormMetadata {
  logo_url?: string | null;
  welcome_title?: string;
  welcome_subtitle?: string;
  welcome_sender_name?: string;
  welcome_sender_note?: string;
  welcome_cta?: string;
  rating_title?: string;
  rating_subtitle?: string;
  rating_cta?: string;
  review_placeholder?: string;
  review_cta?: string;
  thank_you_title?: string;
  show_branding?: boolean;
  heading_font?: string;
  body_font?: string;
}

const LBL = ["Poor", "Fair", "Good", "Great", "Loved it"];
const PR = [
  ["What did you love?", "What I loved most was "],
  ["What problem did we solve?", "Before working together, I was struggling with "],
  ["What would you tell a friend?", "I would recommend them to a friend because "],
];

function parseFormMetadata(customCss?: string | null): FormMetadata {
  if (!customCss) return {};
  try {
    const match = customCss.match(/\/\* __BLOVI_CONFIG__=([\s\S]*?) \*\//);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
  } catch {}
  return {};
}

function normalizeHexColor(input: string): string {
  if (!input) return "#6556A8";
  let val = input.trim();
  if (!val.startsWith("#")) val = `#${val}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(val)) {
    val = `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}`;
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    return val.toUpperCase();
  }
  return "#6556A8";
}

export default function CollectionForm({ form }: { form: FormRow }) {
  const meta = parseFormMetadata(form.custom_css);
  const B = form.name || "Our Team";

  // Steps: 0 = Welcome, 1 = Rating, 2 = Review, 3 = Thank You
  const [step, setStep] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Errors
  const [e1Show, setE1Show] = useState(false);
  const [e2Show, setE2Show] = useState(false);
  const [e3Show, setE3Show] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; left: string; top: string; size: number; delay: number }[]>([]);
  const [mountTime] = useState(() => Date.now());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const brandColor = normalizeHexColor(form.theme_color || "#6556A8");
  const showBranding = meta.show_branding !== false;

  const triggerSparkle = () => {
    const id = Date.now();
    const newSparks = [
      { id: id + 1, left: "62%", top: "26%", size: 16, delay: 0 },
      { id: id + 2, left: "22%", top: "34%", size: 12, delay: 0.12 },
    ];
    setSparkles(newSparks);
    setTimeout(() => setSparkles([]), 1000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;
    setAvatarFile(file);
    const r = new FileReader();
    r.onload = () => setPhotoPreview(r.result as string);
    r.readAsDataURL(file);
  };

  const appendChip = (starter: string) => {
    const trimmed = review.trim();
    const next = trimmed ? (trimmed + (/[.!?]$/.test(trimmed) ? " " : ". ") + starter) : starter;
    setReview(next);
    setE1Show(false);
  };

  const handleNextFromWelcome = () => {
    if (form.collect_rating) {
      setStep(1);
    } else {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2 && !form.collect_rating) {
      setStep(0);
    } else if (step === 2) {
      setStep(1);
    } else if (step === 1) {
      setStep(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const a = review.trim().length < 12;
    const b = !authorName.trim();
    const c = form.require_consent && !consent;

    setE1Show(a);
    setE2Show(b);
    setE3Show(c);

    if (a || b || c) return;

    // Speed check (anti-bot)
    if (Date.now() - mountTime < 2000) {
      setStep(3);
      return;
    }

    setLoading(true);

    let avatarUrl: string | null = null;
    if (avatarFile && (form.collect_photo ?? true)) {
      try {
        const compressedBlob = await compressAvatar(avatarFile);
        const compressedFile = new File([compressedBlob], `avatar-${Date.now()}.webp`, {
          type: "image/webp",
        });
        const uploadData = new FormData();
        uploadData.append("file", compressedFile);
        uploadData.append("userId", form.user_id);
        const { url, error: uploadErr } = await uploadAvatar(uploadData);
        if (uploadErr) {
          setServerError(uploadErr);
          setLoading(false);
          return;
        }
        avatarUrl = url;
      } catch {
        setServerError("Photo upload failed. Try a smaller image, or remove it.");
        setLoading(false);
        return;
      }
    }

    const { error: insertError } = await submitTestimonial({
      formId: form.id,
      userId: form.user_id,
      authorName: authorName.trim() || "Anonymous",
      authorRole: authorRole.trim() || null,
      body: review.trim(),
      rating: form.collect_rating ? (rating || 5) : null,
      consent,
      avatarUrl,
      website,
    });

    if (insertError) {
      setServerError(insertError);
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep(3);
  };

  const handleStartAgain = () => {
    setStep(0);
    setRating(0);
    setHoveredRating(0);
    setReview("");
    setAuthorName("");
    setAuthorRole("");
    setConsent(false);
    setAvatarFile(null);
    setPhotoPreview(null);
    setE1Show(false);
    setE2Show(false);
    setE3Show(false);
    setServerError(null);
  };

  const progressPercent = [0, 33.3, 66.6, 100][step];
  const truncatedQuote = review.trim().length > 116 ? review.trim().slice(0, 116).trimEnd() + "…" : review.trim();

  return (
    <>
      <style>{`
        :root {
          --accent: ${brandColor};
          --ink: #292723;
          --mut: #77716b;
          --bg: #faf9f6;
          --card: rgba(255, 254, 252, .92);
          --field: #fffdfa;
          --line: #e9e5df;
          --soft: #f8f6f2;
        }
        .blovi-shell {
          width: min(100%, 476px);
        }
        .blovi-shell,
        .blovi-card,
        .blovi-inner,
        .blovi-step,
        .blovi-sub,
        .blovi-owner,
        .blovi-btn,
        .blovi-lbl,
        .blovi-note,
        .blovi-hint,
        .blovi-cnt,
        .blovi-chip,
        .blovi-grid,
        .blovi-cons,
        .blovi-thx,
        .blovi-sum,
        .blovi-visit,
        .blovi-brand,
        input.blovi-t,
        textarea.blovi-textarea,
        label.blovi-l {
          font-family: '${meta.body_font || "DM Sans"}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .blovi-h1 {
          font-family: '${meta.heading_font || "Instrument Serif"}', Georgia, serif !important;
        }
        .blovi-sum q {
          font-family: '${meta.heading_font || "Instrument Serif"}', Georgia, serif !important;
        }
        .blovi-card {
          position: relative;
          overflow: hidden;
          min-height: 560px;
          border-radius: 28px;
          background: var(--card);
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 1px 2px rgba(37,31,26,.05), 0 24px 72px -32px rgba(41,35,29,.28);
        }
        .blovi-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(79,63,49,.1);
          z-index: 10;
        }
        .blovi-bar i {
          display: block;
          height: 100%;
          background: var(--accent);
          border-radius: 0 99px 99px 0;
          transition: width .35s cubic-bezier(.22,1,.36,1);
        }
        .blovi-inner {
          min-height: 560px;
          padding: 40px 38px 28px;
          display: flex;
          flex-direction: column;
        }
        .blovi-step {
          display: flex;
          flex-direction: column;
          flex: 1;
          animation: bloviIn .3s cubic-bezier(.22,1,.36,1);
        }
        @keyframes bloviIn {
          from { opacity: 0; transform: translateY(9px); }
          to { opacity: 1; transform: none; }
        }
        .blovi-back {
          position: absolute;
          left: 24px;
          top: 22px;
          border: 0;
          background: none;
          color: var(--mut);
          font: inherit;
          font-size: 12px;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 8px;
          z-index: 20;
          transition: color .15s;
        }
        .blovi-back:hover {
          color: var(--accent);
        }
        .blovi-h1 {
          margin: 0;
          text-align: center;
          font-weight: 400;
          font-size: 37px;
          line-height: 1.05;
          letter-spacing: -.035em;
        }
        .blovi-sub {
          max-width: 350px;
          margin: 12px auto 0;
          text-align: center;
          color: var(--mut);
          font-size: 14px;
          line-height: 1.65;
        }
        .blovi-co {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 0 0 26px;
          font-size: 14px;
          font-weight: 600;
        }
        .blovi-co b {
          width: 34px;
          height: 34px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: color-mix(in srgb, var(--accent) 12%, #fff);
          color: var(--accent);
          font: 600 18px Georgia, serif;
        }
        .blovi-brand-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 28px;
        }
        .blovi-brand-logo img {
          max-height: 44px;
          max-width: 170px;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }
        .blovi-owner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 24px;
          font-size: 12px;
          color: var(--mut);
          line-height: 1.45;
        }
        .blovi-owner span.blovi-av {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 10px;
          font-weight: 700;
          color: #735846;
          background: linear-gradient(145deg, #f0dfce, #ddc2a5);
          border: 2px solid #fff;
          flex: none;
        }
        .blovi-owner strong {
          color: var(--ink);
        }
        .blovi-btn {
          width: 100%;
          min-height: 52px;
          border: 0;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          color: #fff;
          font: inherit;
          font-size: 14px;
          font-weight: 650;
          background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 88%, #a99de6), var(--accent) 72%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 5px 13px color-mix(in srgb, var(--accent) 22%, transparent);
          transition: transform .2s, filter .2s;
        }
        .blovi-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }
        .blovi-btn:active:not(:disabled) {
          transform: scale(.985);
        }
        .blovi-btn:disabled {
          opacity: .45;
          cursor: not-allowed;
          box-shadow: none;
        }
        .blovi-push {
          margin-top: auto;
          padding-top: 28px;
        }
        .blovi-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 14px;
          color: var(--mut);
          font-size: 11px;
        }
        .blovi-hint i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #b7aea5;
        }
        .blovi-stars {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin: 34px 0 8px;
        }
        .blovi-star {
          width: 56px;
          height: 60px;
          border: 0;
          background: none;
          padding: 0;
          display: grid;
          place-items: center;
          color: #e5ded5;
          cursor: pointer;
          transition: color .15s, transform .2s cubic-bezier(.2,.9,.3,1.5);
        }
        .blovi-star svg {
          width: 45px;
          height: 45px;
          fill: currentColor;
          stroke: #cb9130;
          stroke-width: 1.7;
          stroke-linejoin: round;
        }
        .blovi-star.on {
          color: #e7ae47;
          transform: scale(1.05);
        }
        .blovi-star.hv {
          color: #f0c66e;
        }
        .blovi-star:active {
          transform: scale(.9);
        }
        .blovi-lbl {
          min-height: 27px;
          text-align: center;
          color: #8a6b2f;
          font-size: 13px;
          font-weight: 620;
        }
        .blovi-note {
          text-align: center;
          color: var(--mut);
          font-size: 12px;
          margin: 10px 0 0;
        }
        .blovi-spark {
          position: absolute;
          font-size: 18px;
          color: #e3aa49;
          pointer-events: none;
          animation: bloviSpark .8s ease-out forwards;
        }
        @keyframes bloviSpark {
          0% { opacity: 0; transform: scale(.2) rotate(-25deg); }
          40% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(.7) rotate(25deg); }
        }
        .blovi-rev h1 {
          text-align: left;
          font-size: 33px;
        }
        .blovi-rev .blovi-sub {
          text-align: left;
          margin: 9px 0 16px;
          font-size: 13px;
          max-width: none;
        }
        label.blovi-l {
          font-size: 12px;
          font-weight: 650;
          display: block;
          margin-bottom: 7px;
        }
        label.blovi-l small {
          font-weight: 450;
          color: var(--mut);
        }
        .blovi-textarea, input.blovi-t {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: var(--field);
          color: var(--ink);
          font: inherit;
          font-size: 13px;
          padding: 12px 13px;
          transition: border .2s, box-shadow .2s;
        }
        .blovi-textarea {
          min-height: 110px;
          resize: vertical;
          line-height: 1.6;
        }
        input.blovi-t {
          height: 43px;
          padding: 0 11px;
          font-size: 12px;
          border-radius: 11px;
        }
        .blovi-textarea:focus, input.blovi-t:focus {
          outline: 0;
          border-color: color-mix(in srgb, var(--accent) 55%, var(--line));
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent);
        }
        .blovi-cnt {
          text-align: right;
          font-size: 10px;
          color: var(--mut);
          margin-top: 4px;
        }
        .blovi-err {
          color: #b0584b;
          font-size: 11px;
          margin: 5px 0 0;
        }
        .blovi-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin: 8px 0 15px;
        }
        .blovi-chip {
          border: 1px solid var(--line);
          border-radius: 99px;
          background: var(--field);
          color: var(--mut);
          padding: 7px 10px;
          font: inherit;
          font-size: 10px;
          cursor: pointer;
          transition: all .15s;
        }
        .blovi-chip:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .blovi-ph {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }
        .blovi-up {
          position: relative;
          width: 60px;
          height: 60px;
          border: 1px dashed #d3cbc1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: var(--soft);
          cursor: pointer;
          overflow: hidden;
          font-size: 20px;
          flex: none;
          transition: border-color .15s;
        }
        .blovi-up:hover {
          border-color: var(--accent);
        }
        .blovi-up img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .blovi-ph strong {
          font-size: 12px;
        }
        .blovi-ph span {
          display: block;
          font-size: 10px;
          color: var(--mut);
          margin-top: 3px;
        }
        .blovi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 14px;
        }
        .blovi-cons {
          display: flex;
          gap: 9px;
          align-items: flex-start;
          font-size: 11px;
          color: var(--mut);
          line-height: 1.5;
          cursor: pointer;
          margin-bottom: 6px;
          user-select: none;
        }
        .blovi-cons input {
          appearance: none;
          width: 17px;
          height: 17px;
          flex: none;
          border: 1px solid #cfc8bf;
          border-radius: 5px;
          margin: 0;
          background: var(--field);
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all .15s;
        }
        .blovi-cons input:checked {
          background: var(--accent);
          border-color: var(--accent);
        }
        .blovi-cons input::after {
          content: "";
          width: 8px;
          height: 4px;
          margin-top: -2px;
          border-left: 1.7px solid #fff;
          border-bottom: 1.7px solid #fff;
          transform: rotate(-45deg) scale(.3);
          opacity: 0;
          transition: .18s;
        }
        .blovi-cons input:checked::after {
          opacity: 1;
          transform: rotate(-45deg) scale(1);
        }
        .blovi-thx {
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .blovi-chk {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          margin-bottom: 20px;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 9%, #fff);
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 18%, transparent);
        }
        .blovi-chk path {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          animation: bloviDraw .5s .15s ease forwards;
        }
        @keyframes bloviDraw {
          to { stroke-dashoffset: 0; }
        }
        .blovi-sum {
          width: 100%;
          margin-top: 22px;
          padding: 14px 16px;
          border-radius: 15px;
          background: var(--soft);
          text-align: left;
        }
        .blovi-sum .blovi-s {
          color: #dfa943;
          letter-spacing: 2px;
          font-size: 15px;
        }
        .blovi-sum q {
          display: block;
          margin-top: 7px;
          font-size: 17px;
          line-height: 1.35;
          color: var(--ink);
          quotes: none;
        }
        .blovi-sum small {
          display: block;
          margin-top: 7px;
          font-size: 10px;
          color: var(--mut);
        }
        .blovi-lk {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 16px;
          font-size: 11px;
        }
        .blovi-lk a, .blovi-lk button {
          color: var(--mut);
          background: none;
          border: 0;
          font: inherit;
          cursor: pointer;
          text-decoration: none;
          transition: color .15s;
        }
        .blovi-lk a:hover, .blovi-lk button:hover {
          color: var(--accent);
        }
        .blovi-visit {
          margin-top: 14px;
          color: var(--accent);
          font-size: 11px;
          font-weight: 620;
          display: inline-block;
          cursor: pointer;
        }
        .blovi-brand {
          display: flex;
          justify-content: center;
          margin-top: 16px;
        }
        .blovi-brand span {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          padding: 6px 10px;
          border: 1px solid rgba(88, 76, 64, .1);
          border-radius: 99px;
          font-size: 9px;
          color: var(--mut);
        }
        .blovi-brand em {
          font-style: normal;
          color: var(--accent);
          font-weight: 800;
        }
        @media (max-width: 420px) {
          .blovi-inner { padding: 40px 22px 24px; }
          .blovi-grid { grid-template-columns: 1fr; }
          .blovi-h1 { font-size: 33px; }
          .blovi-star { width: 50px; }
          .blovi-stars { gap: 4px; }
        }
      `}</style>

      <div className="blovi-shell">
        <section className="blovi-card" aria-label={`${B} feedback`}>
          {/* Top Progress Line */}
          <div className="blovi-bar">
            <i style={{ width: `${progressPercent}%` }} />
          </div>

          {/* Back Button */}
          {(step === 1 || step === 2) && (
            <button
              type="button"
              onClick={handleBack}
              className="blovi-back"
            >
              ← Back
            </button>
          )}

          <div className="blovi-inner">
            {/* Honeypot field */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* ======================================================== */}
            {/* STEP 0: WELCOME PAGE                                     */}
            {/* ======================================================== */}
            {step === 0 && (
              <div className="blovi-step">
                <div style={{ margin: "auto 0", textAlign: "center" }}>
                  {/* Custom Brand Logo - Medium size, positioned close to Our Team */}
                  {meta.logo_url && (
                    <div className="blovi-brand-logo">
                      <img
                        src={meta.logo_url}
                        alt={B}
                      />
                    </div>
                  )}

                  <div className="blovi-owner">
                    <span className="blovi-av">
                      {(meta.welcome_sender_name || B).slice(0, 2).toUpperCase()}
                    </span>
                    <span style={{ textAlign: "left", maxWidth: 235 }}>
                      <strong>{meta.welcome_sender_name || B}</strong>
                      <br />
                      {meta.welcome_sender_note || "Hey, we'd love to hear how it went."}
                    </span>
                  </div>

                  <h1 className="blovi-h1">
                    {meta.welcome_title || "A little note from you means a lot to us."}
                  </h1>
                  <p className="blovi-sub">
                    {meta.welcome_subtitle || "Your experience can help someone else find the right fit."}
                  </p>
                </div>

                <div className="blovi-push">
                  <button
                    type="button"
                    onClick={handleNextFromWelcome}
                    className="blovi-btn"
                  >
                    {meta.welcome_cta || "Share feedback →"}
                  </button>
                  <div className="blovi-hint">
                    <i /> Takes about 30 seconds
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 1: RATING PAGE                                      */}
            {/* ======================================================== */}
            {step === 1 && (
              <div className="blovi-step" style={{ paddingTop: 30, position: "relative" }}>
                {sparkles.map((sp) => (
                  <span
                    key={sp.id}
                    className="blovi-spark"
                    style={{
                      left: sp.left,
                      top: sp.top,
                      fontSize: `${sp.size}px`,
                      animationDelay: `${sp.delay}s`,
                    }}
                  >
                    ✦
                  </span>
                ))}

                <h1 className="blovi-h1">
                  {meta.rating_title || `How was your experience with ${B}?`}
                </h1>
                <p className="blovi-sub">
                  {meta.rating_subtitle || "Your honest rating means a lot to us."}
                </p>

                <div className="blovi-stars" role="radiogroup" aria-label="Rate your experience from 1 to 5 stars">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const activeRating = hoveredRating || rating;
                    const isOn = i <= activeRating;
                    const isHoverOnly = Boolean(hoveredRating && i <= hoveredRating && i > rating);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setRating(i);
                          if (i === 5) triggerSparkle();
                        }}
                        onMouseEnter={() => setHoveredRating(i)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className={`blovi-star ${isOn ? "on" : ""} ${isHoverOnly ? "hv" : ""}`}
                        role="radio"
                        aria-checked={rating === i}
                        aria-label={`${i} stars — ${LBL[i - 1]}`}
                      >
                        <svg viewBox="0 0 24 24">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    );
                  })}
                </div>

                <div className="blovi-lbl" aria-live="polite">
                  {(hoveredRating || rating) ? LBL[(hoveredRating || rating) - 1] : ""}
                </div>

                <p className="blovi-note">
                  {rating ? "Thank you for being honest with us." : "Tap a star to get started"}
                </p>

                <div className="blovi-push">
                  <button
                    type="button"
                    disabled={!rating}
                    onClick={() => setStep(2)}
                    className="blovi-btn"
                  >
                    {meta.rating_cta || "Continue →"}
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 2: REVIEW PAGE                                      */}
            {/* ======================================================== */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="blovi-step blovi-rev" style={{ paddingTop: 26 }}>
                <h1 className="blovi-h1">
                  {form.headline || "Tell us what stood out."}
                </h1>
                <p className="blovi-sub">
                  {form.prompt || "A sentence or two is plenty. Your words help others decide, and they genuinely make our day."}
                </p>

                <label className="blovi-l" htmlFor="blovi-rv">
                  Your review
                </label>
                <textarea
                  id="blovi-rv"
                  maxLength={1000}
                  value={review}
                  onChange={(e) => {
                    setReview(e.target.value);
                    if (e1Show) setE1Show(false);
                  }}
                  placeholder={meta.review_placeholder || "What did you love? What changed for you?"}
                  className="blovi-textarea"
                />
                <div className="blovi-cnt">{review.length} / 1000</div>
                {e1Show && (
                  <p className="blovi-err">Add a little more detail—12 characters is plenty to start.</p>
                )}

                <div className="blovi-chips">
                  {PR.map(([chipLabel, starter], idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => appendChip(starter)}
                      className="blovi-chip"
                    >
                      {chipLabel}
                    </button>
                  ))}
                </div>

                {/* Photo Upload */}
                {(form.collect_photo ?? true) && (
                  <div className="blovi-ph">
                    <label className="blovi-up" title="Add a photo">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile preview" />
                      ) : (
                        <span>📷</span>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        hidden
                      />
                    </label>
                    <div>
                      <strong>
                        Add a photo <span style={{ display: "inline", color: "var(--mut)", fontWeight: 450 }}>(optional)</span>
                      </strong>
                      <span>Drop an image here or tap to browse</span>
                    </div>
                  </div>
                )}

                {/* Author Name and Role Grid */}
                <div className="blovi-grid">
                  <div>
                    <label className="blovi-l" htmlFor="blovi-nm">
                      Your name
                    </label>
                    <input
                      id="blovi-nm"
                      className="blovi-t"
                      placeholder="e.g. Jane Doe"
                      value={authorName}
                      onChange={(e) => {
                        setAuthorName(e.target.value);
                        if (e2Show) setE2Show(false);
                      }}
                    />
                    {e2Show && <p className="blovi-err">Let us know what to call you.</p>}
                  </div>

                  <div>
                    <label className="blovi-l" htmlFor="blovi-rl">
                      Role / company <small>optional</small>
                    </label>
                    <input
                      id="blovi-rl"
                      className="blovi-t"
                      placeholder="e.g. Founder at Acme"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                    />
                  </div>
                </div>

                {/* Consent Checkbox */}
                {form.require_consent && (
                  <>
                    <label className="blovi-cons">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (e3Show) setE3Show(false);
                        }}
                      />
                      <span>I’m happy for {B} to share my review publicly.</span>
                    </label>
                    {e3Show && (
                      <p className="blovi-err" style={{ marginBottom: 8 }}>
                        Please let us know it’s okay to share your review.
                      </p>
                    )}
                  </>
                )}

                {serverError && (
                  <p className="blovi-err" style={{ marginBottom: 8 }}>
                    {serverError}
                  </p>
                )}

                <div className="blovi-push" style={{ paddingTop: 12 }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="blovi-btn"
                  >
                    {loading ? "Sending your kind words…" : (meta.review_cta || "Share my review →")}
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* STEP 3: THANK YOU PAGE                                   */}
            {/* ======================================================== */}
            {step === 3 && (
              <div className="blovi-step blovi-thx">
                <div className="blovi-chk">
                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                    <path
                      d="M8.5 17.5l5.5 5.5 11.5-12"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h1 className="blovi-h1">
                  {meta.thank_you_title || "You just made our day."}
                </h1>
                <p className="blovi-sub">
                  {form.thank_you_message || "Thank you for sharing a little of your experience. Your words help others find the right fit."}
                </p>

                <div className="blovi-sum">
                  <div className="blovi-s">
                    {"★".repeat(rating || 5)}{"☆".repeat(5 - (rating || 5))}
                  </div>
                  <q>“{truncatedQuote || "Thank you for the wonderful experience!"}”</q>
                  <small>
                    — {authorName || "You"}{authorRole ? `, ${authorRole}` : ""} · {rating || 5} out of 5 stars
                  </small>
                </div>

                <div className="blovi-lk">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Just left a review for ${B}! Highly recommended.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Share on X
                  </a>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                </div>

                <div className="blovi-visit" onClick={handleStartAgain}>
                  Visit {B} ↗
                </div>

                <div className="blovi-lk" style={{ marginTop: 8 }}>
                  <button type="button" onClick={handleStartAgain}>
                    Start again
                  </button>
                </div>

                {showBranding && (
                  <div className="blovi-brand">
                    <span>
                      <em>///</em> Powered by Blovi
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
