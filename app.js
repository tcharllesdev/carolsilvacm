/**
 * Hidratação progressiva dos links da marca Carol Silva | Crochê & Macramê.
 * Lê window.CAROL_LINKS de links.config.js e sincroniza automaticamente os
 * estados ativo (ready) e pendente (pending) preservando os elementos <picture>.
 */
(function initCarolLinks() {
  "use strict";

  const config = window.CAROL_LINKS || {};

  function normalizeUrl(value) {
    if (typeof value !== "string") return "";
    const trimmed = value.trim();
    if (!trimmed) return "";
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
        return parsed.href;
      }
      return "";
    } catch {
      return "";
    }
  }

  const instagramUrl =
    normalizeUrl(config.instagramUrl) || "https://www.instagram.com/carolsilva.cm/";
  const youtubeVideoUrl = normalizeUrl(config.youtubeVideoUrl);
  const youtubeChannelUrl = normalizeUrl(config.youtubeChannelUrl);

  // 1. Atualiza links do Instagram (cabeçalho, card e rodapé)
  document.querySelectorAll("[data-instagram-link]").forEach((anchor) => {
    anchor.setAttribute("href", instagramUrl);
  });

  // 2. Card principal de vídeo do YouTube (ready <-> pending preservando <picture>)
  const videoCard = document.getElementById("youtube-video-card");
  const stageSlot = document.getElementById("youtube-stage-slot");
  const actionSlot = document.getElementById("youtube-action-slot");

  if (videoCard && stageSlot && actionSlot) {
    const existingTrigger = document.getElementById("youtube-stage-trigger");

    if (youtubeVideoUrl) {
      videoCard.dataset.state = "ready";

      if (existingTrigger) {
        if (existingTrigger.tagName === "A") {
          existingTrigger.className = "video-stage video-stage--ready";
          existingTrigger.setAttribute("href", youtubeVideoUrl);
          existingTrigger.setAttribute("target", "_blank");
          existingTrigger.setAttribute("rel", "noopener noreferrer");
          existingTrigger.removeAttribute("aria-describedby");
          existingTrigger.setAttribute(
            "aria-label",
            "Assistir no YouTube: Enfeite de Natal em Crochê — Passo a passo completo (abre em nova aba)"
          );
        } else {
          const stageLink = document.createElement("a");
          stageLink.id = "youtube-stage-trigger";
          stageLink.className = "video-stage video-stage--ready";
          stageLink.href = youtubeVideoUrl;
          stageLink.target = "_blank";
          stageLink.rel = "noopener noreferrer";
          stageLink.setAttribute(
            "aria-label",
            "Assistir no YouTube: Enfeite de Natal em Crochê — Passo a passo completo (abre em nova aba)"
          );
          while (existingTrigger.firstChild) {
            stageLink.appendChild(existingTrigger.firstChild);
          }
          stageSlot.replaceChildren(stageLink);
        }
      }

      const ctaLink = document.createElement("a");
      ctaLink.className = "video-cta";
      ctaLink.href = youtubeVideoUrl;
      ctaLink.target = "_blank";
      ctaLink.rel = "noopener noreferrer";
      ctaLink.innerHTML =
        '<span>Assistir no YouTube</span>' +
        '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
        '<path d="M4.5 11.5 11.5 4.5M11.5 4.5H6M11.5 4.5V10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>";
      actionSlot.replaceChildren(ctaLink);
    } else {
      videoCard.dataset.state = "pending";

      let stageButton = existingTrigger;
      if (existingTrigger && existingTrigger.tagName !== "BUTTON") {
        stageButton = document.createElement("button");
        stageButton.type = "button";
        stageButton.id = "youtube-stage-trigger";
        stageButton.className = "video-stage video-stage--pending";
        stageButton.setAttribute("aria-describedby", "youtube-status-text");
        stageButton.setAttribute(
          "aria-label",
          "Enfeite de Natal em Crochê — Passo a passo completo (vídeo em publicação)"
        );
        while (existingTrigger.firstChild) {
          stageButton.appendChild(existingTrigger.firstChild);
        }
        stageSlot.replaceChildren(stageButton);
      }

      const statusText = document.createElement("p");
      statusText.className = "video-status";
      statusText.id = "youtube-status-text";
      statusText.setAttribute("role", "status");
      statusText.setAttribute("aria-live", "polite");
      statusText.innerHTML =
        '<span class="status-dot" aria-hidden="true"></span>' +
        "<span>Vídeo em publicação — link disponível em breve</span>";
      actionSlot.replaceChildren(statusText);

      if (stageButton && !stageButton.dataset.pendingBound) {
        stageButton.dataset.pendingBound = "true";
        let highlightTimer = null;
        stageButton.addEventListener("click", () => {
          const currentStatus = document.getElementById("youtube-status-text");
          if (!currentStatus) return;
          currentStatus.classList.remove("is-highlighted");
          void currentStatus.offsetWidth;
          currentStatus.classList.add("is-highlighted");
          window.clearTimeout(highlightTimer);
          highlightTimer = window.setTimeout(() => {
            currentStatus.classList.remove("is-highlighted");
          }, 1600);
        });
      }
    }
  }

  // 3. Miniatura do canal do YouTube
  const channelSlot = document.getElementById("youtube-channel-slot");
  if (channelSlot) {
    const ytLogoSvg =
      '<span class="channel-logo channel-logo--youtube" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M23.2 6.8a2.95 2.95 0 0 0-2.08-2.09C19.28 4.2 12 4.2 12 4.2s-7.28 0-9.12.51A2.95 2.95 0 0 0 .8 6.8 30.8 30.8 0 0 0 .3 12c0 1.78.17 3.53.5 5.2a2.95 2.95 0 0 0 2.08 2.09c1.84.51 9.12.51 9.12.51s7.28 0 9.12-.51a2.95 2.95 0 0 0 2.08-2.09c.33-1.67.5-3.42.5-5.2 0-1.78-.17-3.53-.5-5.2ZM9.7 15.4V8.6l5.95 3.4-5.95 3.4Z" fill="currentColor"/>' +
      "</svg>" +
      "</span>";

    if (youtubeChannelUrl) {
      const link = document.createElement("a");
      link.className = "channel-card channel-card--interactive";
      link.href = youtubeChannelUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", "YouTube @carolsilvacm (abre em nova aba)");
      link.innerHTML =
        '<div class="channel-card-top">' +
        ytLogoSvg +
        '<span class="channel-arrow" aria-hidden="true">' +
        '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M4.5 11.5 11.5 4.5M11.5 4.5H6M11.5 4.5V10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg>" +
        "</span>" +
        "</div>" +
        '<div class="channel-text">' +
        '<span class="channel-title">YouTube</span>' +
        '<span class="channel-subtitle">@carolsilvacm</span>' +
        "</div>";
      channelSlot.replaceChildren(link);
    } else {
      const pending = document.createElement("div");
      pending.className = "channel-card channel-card--pending";
      pending.setAttribute("aria-label", "YouTube @carolsilvacm (em breve)");
      pending.innerHTML =
        '<div class="channel-card-top">' +
        ytLogoSvg +
        '<span class="channel-badge">Em breve</span>' +
        "</div>" +
        '<div class="channel-text">' +
        '<span class="channel-title">YouTube</span>' +
        '<span class="channel-subtitle">@carolsilvacm</span>' +
        "</div>";
      channelSlot.replaceChildren(pending);
    }
  }
})();
