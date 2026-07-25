"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { Testimonial } from "../constants";
import { FONT, buildStyle } from "../theme/tokens";
import type { WidgetRadius, WidgetTheme as WallTheme } from "../types/widget";
import type { WidgetPresetId } from "../styles/types";
import { getPresetDefinition } from "../styles/registry";
import { EmptyState, BadgeLink, Stars, VerifiedBadge } from "../components";
import { sendWidgetHeight } from "../utils";

export interface ConversationLayoutProps {
  testimonials: Testimonial[];
  theme: WallTheme;
  showRatings: boolean;
  showBadge: boolean;
  accent?: string;
  radius?: WidgetRadius;
  preset?: WidgetPresetId;
  chatCustomerPrompt?: string;
  chatFounderReply?: string;
}

export function ConversationLayout({
  testimonials,
  theme,
  showRatings,
  showBadge,
  accent,
  radius = "rounded",
  preset = "base",
  chatCustomerPrompt,
  chatFounderReply,
}: ConversationLayoutProps) {
  const presetDef = getPresetDefinition(preset);
  const { colors } = buildStyle(theme, accent, radius, presetDef.preset.overrides);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleStep, setVisibleStep] = useState(0); // 0: initial, 1: customer msg, 2: reply typing -> msg, 3: review bubble
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ResizeObserver for dynamic iframe height adaptation
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const observer = new ResizeObserver(() => {
      sendWidgetHeight();
    });
    observer.observe(containerRef.current);
    sendWidgetHeight();
    return () => observer.disconnect();
  }, [currentIndex, visibleStep, isTyping, testimonials.length]);

  // Animation sequence handler
  const playAnimation = useCallback(() => {
    setVisibleStep(1);
    setIsTyping(true);

    const timer1 = setTimeout(() => {
      setIsTyping(false);
      setVisibleStep(2);

      const timer2 = setTimeout(() => {
        setIsTyping(true);
        const timer3 = setTimeout(() => {
          setIsTyping(false);
          setVisibleStep(3);
        }, 800);
        return () => clearTimeout(timer3);
      }, 500);
      return () => clearTimeout(timer2);
    }, 900);

    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    const cleanup = playAnimation();
    return () => {
      if (cleanup) cleanup();
    };
  }, [currentIndex, playAnimation]);

  const selectConversation = (idx: number) => {
    if (idx === currentIndex || testimonials.length === 0) return;
    setCurrentIndex(idx);
  };

  const goNext = () => {
    if (testimonials.length === 0) return;
    const nextIdx = (currentIndex + 1) % testimonials.length;
    selectConversation(nextIdx);
  };

  const goPrev = () => {
    if (testimonials.length === 0) return;
    const prevIdx = (currentIndex - 1 + testimonials.length) % testimonials.length;
    selectConversation(prevIdx);
  };

  if (testimonials.length === 0) {
    return (
      <div style={{ fontFamily: FONT, padding: "24px", background: colors.pageBg, width: "100%", boxSizing: "border-box" }}>
        <EmptyState colors={colors} />
      </div>
    );
  }

  const current = testimonials[currentIndex] || testimonials[0];
  const quoteText = current.display_body ?? current.body_original;

  // Dynamic dialogue sequence personalized to the author's name & role with custom override support
  const authorFirstName = current.author_name.trim().split(" ")[0] || current.author_name;
  const authorRoleText = current.author_role ? ` for ${current.author_role}` : "";

  const defaultCustomerQuestion = "Hey team! We've been using your product recently and wanted to share some quick feedback.";
  const defaultFounderResponse = `Hi ${authorFirstName}! Thanks for reaching out. We'd love to hear your thoughts${authorRoleText}. How has your experience been?`;

  const customerQuestion = chatCustomerPrompt && chatCustomerPrompt.trim().length > 0 ? chatCustomerPrompt : defaultCustomerQuestion;
  const founderResponse = chatFounderReply && chatFounderReply.trim().length > 0
    ? chatFounderReply.replace(/\{name\}/gi, authorFirstName)
    : defaultFounderResponse;

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: FONT,
        background: colors.pageBg,
        color: colors.text,
        padding: "24px 16px",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <style>{`
        .chat-card {
          max-width: 680px;
          margin: 0 auto;
          background: ${colors.cardBg};
          border: 1px solid ${colors.cardBorder};
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.04);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid ${colors.cardBorder};
          background: ${theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)"};
        }

        .chat-header-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          background: ${colors.cardBorder};
          flex-shrink: 0;
        }

        .chat-user-name {
          font-size: 15px;
          font-weight: 600;
          color: ${colors.name};
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .chat-user-status {
          font-size: 12px;
          color: ${colors.role};
          opacity: 0.75;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
          display: inline-block;
        }

        .chat-body {
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-h: 220px;
        }

        .chat-row {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          max-width: 88%;
          animation: chat-bubble-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .chat-row-left {
          align-self: flex-start;
        }

        .chat-row-right {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .chat-bubble {
          padding: 13px 17px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.5;
          position: relative;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        .chat-bubble-left {
          background: ${theme === "dark" ? "rgba(255,255,255,0.06)" : "#F3F4F6"};
          color: ${colors.text};
          border-bottom-left-radius: 4px;
        }

        .chat-bubble-right {
          background: ${colors.accent};
          color: #FFFFFF;
          border-bottom-right-radius: 4px;
        }

        .chat-bubble-highlight {
          background: ${theme === "dark" ? "rgba(255,255,255,0.08)" : "#F9FAFB"};
          border: 1px solid ${colors.cardBorder};
          color: ${colors.text};
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          padding: 16px;
          width: 100%;
        }

        .chat-timestamp {
          font-size: 10.5px;
          opacity: 0.6;
          margin-top: 4px;
          display: block;
        }

        /* Typing Dots Animation */
        .typing-bubble {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          border-radius: 18px;
          background: ${theme === "dark" ? "rgba(255,255,255,0.06)" : "#E5E7EB"};
          align-self: flex-start;
          animation: chat-bubble-in 0.2s ease-out;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${colors.role};
          opacity: 0.6;
          animation: typing-pulse 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: 0s; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing-pulse {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }

        @keyframes chat-bubble-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .chat-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-top: 1px solid ${colors.cardBorder};
          background: ${theme === "dark" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.5)"};
        }

        .chat-replay-btn {
          background: transparent;
          border: 1px solid ${colors.cardBorder};
          border-radius: 20px;
          padding: 6px 14px;
          font-family: ${FONT};
          font-size: 12px;
          font-weight: 500;
          color: ${colors.text};
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s ease, border-color 0.15s ease;
        }

        .chat-replay-btn:hover {
          background: ${colors.cardBorder};
        }

        .chat-nav-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-nav-btn {
          background: transparent;
          border: none;
          padding: 0;
          font-family: ${FONT};
          font-size: 12px;
          font-weight: 600;
          color: ${colors.accent};
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.15s ease;
        }

        .chat-nav-btn:hover {
          opacity: 1;
        }

        .chat-dots-pagination {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .chat-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
      `}</style>

      <div className="chat-card">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-user">
            {current.avatar_url ? (
              <img src={current.avatar_url} alt={current.author_name} className="chat-avatar" />
            ) : (
              <div
                className="chat-avatar"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: colors.role,
                }}
              >
                {current.author_name.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="chat-user-name">
                {current.author_name}
                <VerifiedBadge id={current.id} />
              </h4>
              <p className="chat-user-status">
                <span className="status-dot" /> Verified Customer {current.author_role ? `· ${current.author_role}` : ""}
              </p>
            </div>
          </div>

          <div className="chat-dots-pagination">
            {testimonials.slice(0, 6).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className="chat-dot"
                onClick={() => selectConversation(idx)}
                style={{
                  background: idx === currentIndex ? colors.accent : colors.dotInactive,
                  transform: idx === currentIndex ? "scale(1.2)" : "scale(1)",
                }}
                aria-label={`Go to conversation ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Chat Body Dialogue */}
        <div className="chat-body">
          {/* Step 1: Customer Question */}
          {visibleStep >= 1 && (
            <div className="chat-row chat-row-left">
              {current.avatar_url ? (
                <img src={current.avatar_url} alt="" className="chat-avatar" style={{ width: 28, height: 28 }} />
              ) : (
                <div
                  className="chat-avatar"
                  style={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {current.author_name.charAt(0)}
                </div>
              )}
              <div>
                <div className="chat-bubble chat-bubble-left">
                  {customerQuestion}
                  <span className="chat-timestamp" style={{ textAlign: "left" }}>10:42 AM</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Founder Reply */}
          {visibleStep >= 2 && (
            <div className="chat-row chat-row-right">
              <div
                className="chat-avatar"
                style={{
                  width: 28,
                  height: 28,
                  background: colors.accent,
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                B
              </div>
              <div>
                <div className="chat-bubble chat-bubble-right">
                  {founderResponse}
                  <span className="chat-timestamp" style={{ textAlign: "right", color: "rgba(255,255,255,0.7)" }}>10:43 AM</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Testimonial & Rating Review Bubble */}
          {visibleStep >= 3 && (
            <div className="chat-row chat-row-left" style={{ maxWidth: "100%" }}>
              {current.avatar_url ? (
                <img src={current.avatar_url} alt="" className="chat-avatar" style={{ width: 28, height: 28 }} />
              ) : (
                <div
                  className="chat-avatar"
                  style={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {current.author_name.charAt(0)}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div className="chat-bubble-highlight">
                  {showRatings && current.rating !== null && (
                    <div style={{ marginBottom: "8px" }}>
                      <Stars rating={current.rating} colors={colors} />
                    </div>
                  )}
                  <p style={{ margin: "0 0 10px 0", fontSize: "14px", lineHeight: "1.55" }}>
                    "{quoteText}"
                  </p>
                  <div style={{ fontSize: "12px", opacity: 0.75, fontWeight: 500 }}>
                    — {current.author_name}{current.author_role ? `, ${current.author_role}` : ""}
                  </div>
                  <span className="chat-timestamp" style={{ textAlign: "left", marginTop: 8 }}>10:44 AM · Verified Review</span>
                </div>
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="chat-footer">
          <button type="button" className="chat-replay-btn" onClick={playAnimation}>
            ↻ Replay Animation
          </button>

          <div className="chat-nav-controls">
            <button type="button" className="chat-nav-btn" onClick={goPrev} aria-label="Previous chat">
              ← Prev
            </button>
            <button type="button" className="chat-nav-btn" onClick={goNext} aria-label="Next chat">
              Next Story →
            </button>
          </div>
        </div>
      </div>

      {showBadge && (
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <BadgeLink colors={colors} />
        </div>
      )}
    </div>
  );
}
