"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Animated Favicon Logic (63 frames cycle)
    let currentFrame = 0;
    const totalFrames = 63;
    const faviconTimer = setInterval(() => {
      currentFrame = (currentFrame + 1) % totalFrames;
      const frameNum = currentFrame === 0 ? 1 : currentFrame;
      const links = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      links.forEach((link) => {
        link.href = `/assets/favicon-frames/frame_${frameNum}.png`;
      });
    }, 100);

    // 2. Birthday Confetti Easter Egg
    const today = new Date();
    const month = today.getMonth();
    const date = today.getDate();

    const showBirthdayEffect = (message: string) => {
      const bgOverlay = document.createElement("div");
      Object.assign(bgOverlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#ffffff",
        zIndex: "9997",
        pointerEvents: "none",
        transition: "opacity 1s ease-out",
        opacity: "1",
      });
      document.body.appendChild(bgOverlay);

      const annivText = document.createElement("div");
      annivText.innerText = message;
      Object.assign(annivText.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "clamp(28px, 6vw, 56px)",
        fontFamily: "'Unbounded', sans-serif",
        fontWeight: "700",
        color: "var(--ink)",
        textAlign: "center",
        zIndex: "9999",
        pointerEvents: "none",
        transition: "opacity 1s ease-out, transform 1s ease-out",
        opacity: "0",
        textShadow: "0 4px 32px var(--canvas), 0 0 16px var(--canvas), 0 0 8px var(--canvas)",
      });
      document.body.appendChild(annivText);

      setTimeout(() => {
        annivText.style.opacity = "1";
        annivText.style.transform = "translate(-50%, -60%)";
      }, 100);

      const duration = 3 * 1000;
      const end = Date.now() + duration;
      const colors = ["#b8a4ed", "#ff4d8b", "#a7c7e7", "#ffb084", "#e8b94a", "#a4d4c5"];

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
          zIndex: 9998,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
          zIndex: 9998,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          annivText.style.opacity = "0";
          annivText.style.transform = "translate(-50%, -70%)";
          bgOverlay.style.opacity = "0";
          setTimeout(() => {
            annivText.remove();
            bgOverlay.remove();
          }, 1000);
        }
      };
      frame();
    };

    if (month === 8 && date === 21) {
      showBirthdayEffect("Today is Echo Music's Birthday! 🎉");
    } else if (month === 9 && date === 14) {
      showBirthdayEffect("Today is the Developer's Birthday! 🎉");
    }

    // 3. Navbar scroll & Floating Support button
    const navbar = document.getElementById("navbar");
    const supportFab = document.getElementById("support-fab");
    const fabBubble = document.querySelector(".support-msg-bubble");
    const supportBtn = document.querySelector(".support-btn") as HTMLElement;
    const footer = document.querySelector("footer");

    let hasTyped = false;
    const msg = "Hi! If you love Echo Music, consider supporting my work! ☕";
    let typeIndex = 0;

    const typeWriter = () => {
      const typeText = document.getElementById("typewriter-text");
      if (typeText && typeIndex < msg.length) {
        typeText.innerHTML += msg.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 40);
      } else {
        setTimeout(() => {
          const cursor = document.querySelector(".cursor") as HTMLElement;
          if (cursor) cursor.style.display = "none";
        }, 2000);
      }
    };

    const startTypeWriter = () => {
      if (!hasTyped) {
        hasTyped = true;
        setTimeout(typeWriter, 300);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (navbar) {
        if (currentScrollY > 150) {
          navbar.classList.add("visible");
        } else {
          navbar.classList.remove("visible");
        }
      }

      const scrollPosition = window.scrollY + window.innerHeight;
      const bodyHeight = document.body.offsetHeight;
      const footerHeight = footer ? footer.offsetHeight : 0;
      const isNearBottom = scrollPosition > bodyHeight - footerHeight + 20;

      if (supportFab) {
        supportFab.style.opacity = isNearBottom ? "0" : "1";
        if (supportBtn) supportBtn.style.pointerEvents = isNearBottom ? "none" : "auto";
      }

      if (currentScrollY > 50 && !isNearBottom) {
        if (fabBubble) fabBubble.classList.add("show");
        startTypeWriter();
      } else {
        if (fabBubble) fabBubble.classList.remove("show");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Call once initially to set correct state
    handleScroll();

    // 4. Live Stats Fetch & Counter Animation
    const animateValue = (
      obj: HTMLElement,
      start: number,
      end: number,
      duration: number,
      prefix = "",
      suffix = ""
    ) => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeProgress * (end - start) + start);
        if (obj) obj.innerHTML = `${prefix}${current.toLocaleString()}${suffix}`;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          if (obj) obj.innerHTML = `${prefix}${end.toLocaleString()}${suffix}`;
        }
      };
      window.requestAnimationFrame(step);
    };

    const fetchLiveStats = async () => {
      try {
        const repoRes = await fetch("https://api.github.com/repos/EchoMusicApp/Echo-Music");
        if (repoRes.ok) {
          const repoData = await repoRes.json();
          const starsEl = document.getElementById("stat-stars");
          if (starsEl) animateValue(starsEl, 0, repoData.stargazers_count, 2000, "⭐ ", " GitHub Stars");
        }

        const relsRes = await fetch(
          "https://api.github.com/repos/EchoMusicApp/Echo-Music/releases?per_page=100"
        );
        if (relsRes.ok) {
          const relsData = await relsRes.json();
          let dls = 0;
          let apkUrl = "";

          relsData.forEach((rel: any) => {
            rel.assets?.forEach((a: any) => {
              dls += a.download_count || 0;
            });
          });

          const latestStable = relsData.find((r: any) => !r.prerelease) || relsData[0];
          if (latestStable) {
            apkUrl = latestStable.html_url;
            latestStable.assets?.forEach((a: any) => {
              if (a.name.endsWith(".apk")) apkUrl = a.browser_download_url;
            });
          }

          if (dls > 0) {
            const dlEl = document.getElementById("stat-downloads");
            if (dlEl) animateValue(dlEl, 0, dls, 2000, "📦 ", "+ Downloads");
          }

          if (apkUrl) {
            document.querySelectorAll<HTMLAnchorElement>(".btn-download").forEach((btn) => {
              btn.href = apkUrl;
            });
          }
        }
      } catch (e) {
        console.warn("Could not fetch live stats", e);
      }
    };
    fetchLiveStats();

    // 5. Button Ripple Effect (Clicks & Touches)
    const createRipple = (event: MouseEvent | TouchEvent) => {
      const button = event.currentTarget as HTMLElement;
      if (!button) return;
      const circle = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      let x: number, y: number;
      if ("touches" in event && event.touches && event.touches.length > 0) {
        x = event.touches[0].clientX - button.getBoundingClientRect().left;
        y = event.touches[0].clientY - button.getBoundingClientRect().top;
      } else {
        const mouseEvt = event as MouseEvent;
        x = mouseEvt.clientX - button.getBoundingClientRect().left;
        y = mouseEvt.clientY - button.getBoundingClientRect().top;
      }

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${x - radius}px`;
      circle.style.top = `${y - radius}px`;
      circle.classList.add("ripple-span");

      const existingRipple = button.querySelector(".ripple-span");
      if (existingRipple) {
        existingRipple.remove();
      }

      button.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    };

    const rippleButtons = document.querySelectorAll(".btn.ripple");
    rippleButtons.forEach((btn) => {
      btn.addEventListener("mousedown", createRipple as any);
      btn.addEventListener("touchstart", createRipple as any, { passive: true });
    });

    // 6. FAQ Accordion Interaction
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer") as HTMLElement;
      const icon = item.querySelector(".faq-icon");

      if (question && answer && icon) {
        question.addEventListener("click", () => {
          const isOpen = item.classList.contains("open");

          faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
              otherItem.classList.remove("open");
              const otherIcon = otherItem.querySelector(".faq-icon");
              const otherAnswer = otherItem.querySelector(".faq-answer") as HTMLElement;
              if (otherIcon) otherIcon.textContent = "+";
              if (otherAnswer) otherAnswer.style.maxHeight = "";
            }
          });

          if (isOpen) {
            item.classList.remove("open");
            icon.textContent = "+";
            answer.style.maxHeight = "";
          } else {
            item.classList.add("open");
            icon.textContent = "−";
            answer.style.maxHeight = `${answer.scrollHeight + 36}px`;
          }
        });
      }
    });

    // 7. Scroll Animation Observers (Feature Cards & FAQ Items)
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.1,
    };

    const featureObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const featureCards = document.querySelectorAll(".feature-card");
    featureCards.forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 80}ms`;
      featureObserver.observe(card);
    });

    const faqObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    faqItems.forEach((item, index) => {
      (item as HTMLElement).style.transitionDelay = `${index * 60}ms`;
      faqObserver.observe(item);
    });

    // 8. General Reveal Elements Observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    // 9. Site notice auto dismiss
    const noticeTimeout = setTimeout(() => {
      const notice = document.getElementById("site-notice");
      if (notice) {
        notice.style.transform = "translateY(-100%)";
        setTimeout(() => notice.remove(), 500);
      }
    }, 5000);

    // 10. Countdown timer logic (Auto-unlocks download buttons)
    let timeLeft = 30;
    const timerSpans = document.querySelectorAll(".countdown-timer");
    const timerMsgSpans = document.querySelectorAll(".countdown-timer-msg");
    const countdownBtns = document.querySelectorAll<HTMLElement>(".countdown-btn");
    const actualDownloadBtns = document.querySelectorAll<HTMLAnchorElement>(".actual-download-btn");
    const countdownMsgs = document.querySelectorAll<HTMLElement>(".countdown-msg");

    const countdownInterval = setInterval(() => {
      timeLeft--;
      timerSpans.forEach((span) => (span.textContent = String(timeLeft)));
      timerMsgSpans.forEach((span) => (span.textContent = String(timeLeft)));

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        countdownBtns.forEach((btn) => (btn.style.display = "none"));
        actualDownloadBtns.forEach((btn) => (btn.style.display = "inline-flex"));
        countdownMsgs.forEach((m) => (m.style.display = "none"));
      }
    }, 1000);

    return () => {
      clearInterval(faviconTimer);
      clearInterval(countdownInterval);
      clearTimeout(noticeTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{
        __html: "<nav id=\"navbar\">\n    <div class=\"container nav-inner\">\n      <a href=\"/\" class=\"nav-logo display-font\">\n        <img src=\"/assets/Echo.gif\" alt=\"\" class=\"nav-logo-img\">\n        Echo Music\n      </a>\n      <div class=\"nav-links\">\n        <div class=\"nav-download-container\" style=\"display: flex; align-items: center; justify-content: center;\">\n          <button class=\"btn btn-primary countdown-btn\" disabled style=\"height: 40px; padding: 0 16px; max-width: max-content; opacity: 0.8; cursor: not-allowed; background-color: #6a6a6a; color: white; font-size: 13px; white-space: nowrap;\">Wait <span class=\"countdown-timer\">30</span>s</button>\n          <a href=\"https://github.com/EchoMusicApp/Echo-Music/releases/latest\" class=\"btn btn-primary ripple btn-download actual-download-btn\" style=\"height: 40px; padding: 0 20px; max-width: max-content; display: none;\" target=\"_blank\" rel=\"noopener noreferrer\">Download</a>\n        </div>\n      </div>\n    </div>\n  </nav>\n\n  <header class=\"hero container\">\n    <img src=\"/assets/Echo.gif\" alt=\"Echo Music - Free Music Streaming App Logo\" class=\"hero-logo reveal\">\n    <h1 class=\"display-xl reveal\">Music that moves you.<br><span class=\"display-lg\">No ads. No limits.</span></h1>\n    <p class=\"hero-sub body-md reveal\">\n      Echo Music is a free music streaming app for Android with ad-free playback, synced lyrics, offline downloads, and an intuitive Material You experience.\n    </p>\n    <div class=\"hero-ctas reveal\">\n      <div class=\"hero-download-container\" style=\"display: flex; flex-direction: column; align-items: center; gap: 8px;\">\n        <button class=\"btn btn-primary countdown-btn\" disabled style=\"opacity: 0.8; cursor: not-allowed; background-color: #6a6a6a; color: white; width: 100%; height: auto; min-height: 48px; padding: 12px 16px; line-height: 1.3; white-space: normal; text-align: center; font-size: 14px;\">Wait <span class=\"countdown-timer\">30</span> seconds download will start automatically</button>\n        <a href=\"https://github.com/EchoMusicApp/Echo-Music/releases/latest\" class=\"btn btn-primary ripple btn-download actual-download-btn\" style=\"display: none; width: 100%;\" target=\"_blank\" rel=\"noopener noreferrer\">Download APK</a>\n        <p class=\"countdown-msg\" style=\"font-size: 13px; color: var(--muted); max-width: 280px; text-align: center; margin: 0; line-height: 1.3;\">I know ads are annoying, but it still hardly takes a minute to download, and it helps keep the project alive.</p>\n      </div>\n      <a href=\"https://github.com/EchoMusicApp/Echo-Music\" class=\"btn btn-secondary ripple\">View Source Code</a>\n    </div>\n    <p class=\"reveal\" style=\"font-size: 0.85rem; color: #a0a0a0; margin-top: 16px;\">\n      Note: If the download gets stuck at 100%, please try using a different browser.\n    </p>\n  </header>\n\n  <!-- Middle Ad Banner -->\n  <div style=\"display: flex; justify-content: center; margin: 32px 0;\">\n    \n    <div id=\"container-5a53c845f7f73674a8ffc31937e7c0e1\"></div>\n  </div>\n\n  <section class=\"ticker\">\n    <div class=\"container ticker-inner\">\n      <div class=\"ticker-item title-md reveal\" id=\"stat-stars\">\u2b50 2.1k+ GitHub Stars</div>\n      <div class=\"ticker-item title-md reveal\" id=\"stat-downloads\">\ud83d\udce6 1,000,000+ Downloads</div>\n    </div>\n  </section>\n\n  <section class=\"screenshots\">\n    <div class=\"container screenshots-header reveal\">\n      <p class=\"screenshots-label caption-uppercase\">SEE IT IN ACTION</p>\n      <h2 class=\"screenshots-title display-md\">Built for the way you listen</h2>\n    </div>\n    <div class=\"scroll-strip-wrapper\">\n\n      <div class=\"marquee-group\">\n        <div class=\"phone-mockup-wrapper\">\n          <img src=\"/assets/Screenshot/Home.png\" alt=\"Home\" class=\"phone-mockup\">\n          <p class=\"caption\" style=\"color: var(--muted)\">Home</p>\n        </div>\n        <div class=\"phone-mockup-wrapper\">\n          <img src=\"/assets/Screenshot/search page.png\" alt=\"Search\" class=\"phone-mockup\">\n          <p class=\"caption\" style=\"color: var(--muted)\">Search</p>\n        </div>\n\n        <div class=\"phone-mockup-wrapper\">\n          <img src=\"/assets/Screenshot/Material you music page.png\" alt=\"Now Playing\" class=\"phone-mockup\">\n          <p class=\"caption\" style=\"color: var(--muted)\">Now Playing</p>\n        </div>\n\n        <div class=\"phone-mockup-wrapper\">\n          <img src=\"/assets/Screenshot/Apple inspired music page.png\" alt=\"Apple Style Player\" class=\"phone-mockup\">\n          <p class=\"caption\" style=\"color: var(--muted)\">Apple Style</p>\n        </div>\n\n        <div class=\"phone-mockup-wrapper\">\n          <img src=\"/assets/Screenshot/lyrics.png\" alt=\"Lyrics\" class=\"phone-mockup\">\n          <p class=\"caption\" style=\"color: var(--muted)\">Lyrics</p>\n        </div>\n        <div class=\"phone-mockup-wrapper\">\n          <img src=\"/assets/Screenshot/library.png\" alt=\"Library\" class=\"phone-mockup\">\n          <p class=\"caption\" style=\"color: var(--muted)\">Library</p>\n        </div>\n      </div>\n\n      <div class=\"marquee-group\">\n        <div class=\"phone-mockup-wrapper\">\n          <img src=\"/assets/Screenshot/Home.png\" alt=\"Home\" class=\"phone-mockup\">\n          <p class=\"caption\" style=\"color: var(--muted)\">Home</p>\n        </div>\n        <div class=\"phone-mockup-wrapper\">\n          <img src=\"/assets/Screenshot/search page.png\" alt=\"Search\" class=\"phone-mockup\">\n          <p class=\"caption\" style=\"color: var(--muted)\">Search</p>\n        </div>\n\n        <div class=\"phone-mockup-wrapper\">\n          <img src=\"/assets/Screenshot/Material you music page.png\" alt=\"Now Playing\" class=\"phone-mockup\">\n          <p class=\"caption\" style=\"color: var(--muted)\">Now Playing</p>\n        </div>\n\n        <div class=\"phone-mockup-wrapper\">\n          <img src=\"/assets/Screenshot/Apple inspired music page.png\" alt=\"Apple Style Player\" class=\"phone-mockup\">\n          <p class=\"caption\" style=\"color: var(--muted)\">Apple Style</p>\n        </div>\n\n        <div class=\"phone-mockup-wrapper\">\n          <img src=\"/assets/Screenshot/lyrics.png\" alt=\"Lyrics\" class=\"phone-mockup\">\n          <p class=\"caption\" style=\"color: var(--muted)\">Lyrics</p>\n        </div>\n        <div class=\"phone-mockup-wrapper\">\n          <img src=\"/assets/Screenshot/library.png\" alt=\"Library\" class=\"phone-mockup\">\n          <p class=\"caption\" style=\"color: var(--muted)\">Library</p>\n        </div>\n      </div>\n    </div>\n  </section>\n\n\n\n  <section class=\"features container\">\n    <div class=\"features-header\">\n      <p class=\"caption-uppercase\" style=\"color: var(--muted); margin-bottom: var(--space-sm);\">WHY ECHO</p>\n      <h2 class=\"display-md\" style=\"color: var(--ink); margin-bottom: var(--space-sm);\">Everything you need, nothing you don't</h2>\n      <p class=\"body-md\" style=\"color: var(--muted); max-width: 540px; margin: 0 auto;\">Eight reasons people choose Echo over every other music player.</p>\n    </div>\n    <div class=\"features-grid\">\n      <div class=\"feature-card feature-card-1 col-span-2 flex-row\">\n        <svg class=\"feature-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242\"/><path d=\"M12 12v9\"/><path d=\"m8 17 4 4 4-4\"/></svg>\n        <div class=\"feature-content\">\n          <h3 class=\"title-md\">Offline Playback</h3>\n          <p class=\"body-sm feature-body\">Download your music and listen anywhere - no signal needed.</p>\n        </div>\n      </div>\n      <div class=\"feature-card feature-card-2\">\n        <svg class=\"feature-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12\"/><circle cx=\"17\" cy=\"7\" r=\"5\"/></svg>\n        <div class=\"feature-content\">\n          <h3 class=\"title-md\">Synced Lyrics</h3>\n          <p class=\"body-sm feature-body\">Real-time lyrics that scroll along as the song plays. Never miss a word.</p>\n        </div>\n      </div>\n      <div class=\"feature-card feature-card-3\">\n        <svg class=\"feature-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m4.9 4.9 14.2 14.2\"/></svg>\n        <div class=\"feature-content\">\n          <h3 class=\"title-md\">Zero Ads, Forever</h3>\n          <p class=\"body-sm feature-body\">No banners. No pre-rolls. No interruptions. Music the way it should be.</p>\n        </div>\n      </div>\n      <div class=\"feature-card feature-card-4\">\n        <svg class=\"feature-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 15V6\"/><path d=\"M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z\"/><path d=\"M12 12H3\"/><path d=\"M16 6H3\"/><path d=\"M12 18H3\"/></svg>\n        <div class=\"feature-content\">\n          <h3 class=\"title-md\">Smart Queue</h3>\n          <p class=\"body-sm feature-body\">Echo learns your listening habits and builds a queue you'll actually love.</p>\n        </div>\n      </div>\n      <div class=\"feature-card feature-card-5\">\n        <svg class=\"feature-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m18 16 4-4-4-4\"/><path d=\"m6 8-4 4 4 4\"/><path d=\"m14.5 4-5 16\"/></svg>\n        <div class=\"feature-content\">\n          <h3 class=\"title-md\">Open Source</h3>\n          <p class=\"body-sm feature-body\">Every line of code is public. Fork it, audit it, improve it - it's yours.</p>\n        </div>\n      </div>\n\n      <div class=\"feature-card feature-card-9 col-span-2 flex-row\">\n        <svg class=\"feature-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/></svg>\n        <div class=\"feature-content\">\n          <h3 class=\"title-md\">Listen Together</h3>\n          <p class=\"body-sm feature-body\">Sync music in real time with your friends, similar to Spotify Jam.</p>\n        </div>\n      </div>\n\n      <div class=\"feature-card feature-card-13\">\n        <svg class=\"feature-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z\"/><path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"/><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"22\"/></svg>\n        <div class=\"feature-content\">\n          <h3 class=\"title-md\">Podcast Support</h3>\n          <p class=\"body-sm feature-body\">Listen to your favorite podcasts alongside your music library.</p>\n        </div>\n      </div>\n      <div class=\"feature-card feature-card-14 col-span-3 flex-row\">\n        <svg class=\"feature-icon-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 3v18h18\"/><path d=\"M18.7 8l-5.1 5.2-2.8-2.7L7 14.3\"/></svg>\n        <div class=\"feature-content\">\n          <h3 class=\"title-md\">Data Saver Mode</h3>\n          <p class=\"body-sm feature-body\">Automatically reduces data usage during playback for limited connections.</p>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"faq\">\n    <div class=\"faq-header\">\n      <p class=\"caption-uppercase\" style=\"color: var(--muted); margin-bottom: var(--space-sm);\">QUESTIONS</p>\n      <h2 class=\"display-md\" style=\"color: var(--ink);\">Straight answers</h2>\n    </div>\n    <div class=\"faq-list\">\n      <div class=\"faq-item\">\n        <div class=\"faq-question\">\n          <h3 class=\"title-sm\">Is Echo Music really free?</h3>\n          <span class=\"faq-icon\">+</span>\n        </div>\n        <div class=\"faq-answer\">\n          <p class=\"body-md\">Yes, completely. Echo has no paid tiers, no ads, and no subscription. It's open-source software supported by the community.</p>\n        </div>\n      </div>\n      <div class=\"faq-item\">\n        <div class=\"faq-question\">\n          <h3 class=\"title-sm\">Where do I download Echo?</h3>\n          <span class=\"faq-icon\">+</span>\n        </div>\n        <div class=\"faq-answer\">\n          <p class=\"body-md\">Echo is distributed through GitHub Releases. Tap the Download button above to go directly to the latest APK.</p>\n        </div>\n      </div>\n      <div class=\"faq-item\">\n        <div class=\"faq-question\">\n          <h3 class=\"title-sm\">Does Echo need an account?</h3>\n          <span class=\"faq-icon\">+</span>\n        </div>\n        <div class=\"faq-answer\">\n          <p class=\"body-md\">No account, no sign-up, no tracking. Open the app and play.</p>\n        </div>\n      </div>\n\n      <div class=\"faq-item\">\n        <div class=\"faq-question\">\n          <h3 class=\"title-sm\">What Android version do I need?</h3>\n          <span class=\"faq-icon\">+</span>\n        </div>\n        <div class=\"faq-answer\">\n          <p class=\"body-md\">Echo runs on Android 6.0 (Marshmallow) and above.</p>\n        </div>\n      </div>\n      <div class=\"faq-item\">\n        <div class=\"faq-question\">\n          <h3 class=\"title-sm\">Can I contribute to Echo?</h3>\n          <span class=\"faq-icon\">+</span>\n        </div>\n        <div class=\"faq-answer\">\n          <p class=\"body-md\">Absolutely. Head to github.com/EchoMusicApp/Echo-Music to open issues, submit PRs, or suggest features. All contributors are welcome.</p>\n        </div>\n      </div>\n      <div class=\"faq-item\">\n        <div class=\"faq-question\">\n          <h3 class=\"title-sm\">Where does the music come from?</h3>\n          <span class=\"faq-icon\">+</span>\n        </div>\n        <div class=\"faq-answer\">\n          <p class=\"body-md\">Echo Music is a third-party YouTube Music client. It provides a customized app experience, but Echo Music itself does not host, own, or hold any of the songs.</p>\n        </div>\n      </div>\n\n    </div>\n  </section>\n\n\n\n  <footer>\n    <div class=\"container\">\n      <div class=\"footer-grid\">\n        <div class=\"footer-col-left\">\n          <div class=\"footer-logo display-font\">\n             <img src=\"/assets/Echo.gif\" alt=\"\">\n             Echo Music\n          </div>\n          <div class=\"footer-disclaimer caption\" style=\"margin-top: 16px; color: var(--muted); max-width: 280px; line-height: 1.4;\">\n            Echo Music is a third-party YouTube Music client. Echo Music does not host or hold any of the audio content.\n          </div>\n        </div>\n        <div class=\"footer-col-right\">\n\n          <div class=\"footer-column\">\n            <div class=\"footer-column-title display-font\">Links</div>\n            <a href=\"/privacy\" class=\"footer-link\">Privacy Policy</a>\n            <a href=\"/terms\" class=\"footer-link\">Terms & Conditions</a>\n            <a href=\"https://www.virustotal.com/gui/file/c3c56f68149f8580b895c42cd8355973421c10e38288620d7317590704ef85ff/detection\" class=\"footer-link\" target=\"_blank\" rel=\"noopener noreferrer\">VirusTotal Scan</a>\n          </div>\n\n\n        </div>\n      </div>\n    </div>\n  </footer>\n\n\n  <div class=\"support-fab\" id=\"support-fab\">\n\n    <a href=\"/donate\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"text-decoration: none; display: flex; flex-direction: column; align-items: flex-end; gap: 16px; pointer-events: none;\">\n      <div class=\"support-msg-bubble\" style=\"position: relative; margin-top: 85px;\">\n        <img src=\"/assets/cat.gif\" alt=\"Cat\" style=\"width: 90px; height: auto; position: absolute; top: -80px; left: 50%; transform: translateX(-50%); z-index: 1;\">\n        <span style=\"position: relative; z-index: 2;\"><span id=\"typewriter-text\"></span><span class=\"cursor\">|</span></span>\n      </div>\n      <div class=\"support-btn\" style=\"pointer-events: auto;\">\n        <img src=\"/assets/iad1tya.png\" alt=\"Aditya\" class=\"support-avatar\">\n      </div>\n    </a>\n  </div>\n\n  \n  \n  \n  <!-- Ads -->\n  \n  \n  \n  <!-- Direct Link: https://omg10.com/4/11642609 -->\n  \n  \n  <div id=\"site-notice\" style=\"position: fixed; top: 0; left: 0; width: 100%; background: #0a1a1a; color: #fff; text-align: center; padding: 16px; z-index: 9999; font-weight: 600; font-family: 'Inter', sans-serif; transition: transform 0.5s ease-in-out;\">\n    Site Contains the ads to cover up the costs\n  </div>"
      }}
    />
  );
}
