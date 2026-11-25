"use client";

import { useEffect } from "react";

export default function DonatePage() {
  useEffect(() => {
    const redirectUrl = "https://support.iad1tya.cyou/";
    const totalTime = 5000;
    const intervalTime = 50;
    let elapsedTime = 0;

    const progressBar = document.getElementById("progress-bar");
    const countdownEl = document.getElementById("countdown");
    const skipBtn = document.getElementById("skip-btn");

    function redirectNow() {
      window.location.href = redirectUrl;
    }

    function createRipple(event: MouseEvent) {
      const button = event.currentTarget as HTMLElement;
      if (!button) return;
      const circle = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      circle.style.width = circle.style.height = diameter + "px";

      const rect = button.getBoundingClientRect();
      const x = event.clientX !== undefined ? event.clientX - rect.left : rect.width / 2;
      const y = event.clientY !== undefined ? event.clientY - rect.top : rect.height / 2;

      circle.style.left = x - radius + "px";
      circle.style.top = y - radius + "px";
      circle.classList.add("ripple-span");

      const existingRipple = button.getElementsByClassName("ripple-span")[0];
      if (existingRipple) {
        existingRipple.remove();
      }
      button.appendChild(circle);
    }

    if (skipBtn) {
      skipBtn.addEventListener("click", function (e) {
        createRipple(e);
        setTimeout(redirectNow, 300);
      });
    }

    const timer = setInterval(() => {
      elapsedTime += intervalTime;
      const percentage = (elapsedTime / totalTime) * 100;
      if (progressBar) progressBar.style.width = percentage + "%";

      const remainingSeconds = Math.ceil((totalTime - elapsedTime) / 1000);
      if (countdownEl) countdownEl.textContent = String(remainingSeconds);

      if (elapsedTime >= totalTime) {
        clearInterval(timer);
        redirectNow();
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="donate-wrapper">
      <div className="card">
        <p>Taking you to the support page...</p>

        <div className="progress-container">
          <div className="progress-bar" id="progress-bar"></div>
        </div>
        <div className="redirect-text">
          Redirecting in <span id="countdown">5</span>s...
        </div>

        <button id="skip-btn" className="btn btn-primary ripple">
          Skip
        </button>
      </div>
    </div>
  );
}
