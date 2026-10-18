/**
 * Graduation Invitation - Interactive Logic (100% Static Web Compatible)
 * Works both via HTTP/HTTPS server and direct file:/// opening
 */

(function () {
  "use strict";

  // Constants & Details
  const EVENT_INFO = {
    title: "Lễ Tốt Nghiệp - ĐH Tôn Đức Thắng",
    location:
      "Trường Đại học Tôn Đức Thắng, 19 Nguyễn Hữu Thọ, Phường Tân Phong / Tân Hưng, Quận 7, TP. Hồ Chí Minh",
    startDate: "20261023T030000Z", // 10:00 AM VN time (UTC+7 -> 03:00 UTC)
    endDate: "20261023T043000Z", // 11:30 AM VN time (UTC+7 -> 04:30 UTC)
    phone: "0396371201",
    zaloUrl: "https://zalo.me/0396371201",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=%C4%90%E1%BA%A1i+h%E1%BB%8Dc+T%C3%B4n+%C4%90%E1%BB%A9c+Th%E1%BA%AFng+19+Nguy%E1%BB%85n+H%E1%BB%AFu+Th%E1%BB%8D",
  };

  // ==========================================
  // 1. Customer.json Loading & URL Slug Parsing
  // ==========================================
  let customersData = [];

  async function loadCustomers() {
    try {
      const response = await fetch("customer.json?t=" + Date.now());
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          customersData = data;
        }
      }
    } catch (e) {
      console.info("Using local customer list:", customersData);
    }
  }

  function getSlugFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const candidate = params.get("name");

      if (candidate && candidate.trim()) {
        return candidate.trim();
      }
    } catch (e) {
      console.warn("URLSearchParams error:", e);
    }
    return null;
  }

  function findCustomer(slug) {
    if (!slug || typeof slug !== "string") return null;
    const clean = slug.trim().toLowerCase();

    return (
      customersData.find((c) => c.slug && c.slug.toLowerCase() === clean) ||
      null
    );
  }

  function renderGuest(name, personal) {
    console.log(name);
    console.log(personal);
    const guestNameElements = document.querySelectorAll(".guest-name-text");
    const guestLabelElements = document.querySelectorAll(".recipient-label");
    guestNameElements.forEach((el) => {
      el.textContent = name;
    });

    const labelText = personal ? `Thân mời ${personal} :` : "Thân mời :";
    guestLabelElements.forEach((el) => {
      el.textContent = labelText;
    });

    document.title = `Thư mời Lễ Tốt Nghiệp - ${labelText} ${name}`;
    updateShareUrlDisplay(name);
  }

  function updateShareUrlDisplay(nameOrSlug) {
    const shareUrlDisplay = document.getElementById("shareUrlDisplay");
    if (!shareUrlDisplay) return;

    const matched = findCustomer(nameOrSlug);
    const paramVal = matched ? matched.slug : nameOrSlug;

    try {
      const url = new URL(window.location.href);
      ["name", "slug", "to", "guest", "ten", "u", "id", "n"].forEach((k) =>
        url.searchParams.delete(k),
      );
      url.searchParams.set("slug", paramVal);
      shareUrlDisplay.value = url.toString();
    } catch (e) {
      const base = window.location.href.split("?")[0];
      shareUrlDisplay.value = `${base}?slug=${encodeURIComponent(paramVal)}`;
    }
  }

  window.setGuestName = function (slug, updateUrl = true) {
    const cleanSlug = (slug || "").trim() || "";
    const customer = findCustomer(cleanSlug);

    const finalName = customer ? customer.name : cleanSlug;
    const finalPersonal = customer ? customer.personal : "";
    const paramVal = customer ? customer.slug : cleanSlug;

    renderGuest(finalName, finalPersonal);

    if (updateUrl) {
      try {
        const url = new URL(window.location.href);
        ["name", "slug", "to", "guest", "ten", "u", "id", "n"].forEach((k) =>
          url.searchParams.delete(k),
        );
        url.searchParams.set("slug", paramVal);
        window.history.replaceState({}, "", url.toString());
      } catch (e) {
        // Ignored on file:/// where replaceState may be restricted
      }
    }
  };

  // ==========================================
  // 2. Safe Clipboard Helper (Works on file://)
  // ==========================================
  function copyToClipboard(text) {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      return navigator.clipboard
        .writeText(text)
        .catch(() => fallbackCopy(text));
    }
    return fallbackCopy(text);
  }

  function fallbackCopy(text) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful
        ? Promise.resolve()
        : Promise.reject(new Error("execCommand failed"));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // ==========================================
  // 3. Toast Notifications
  // ==========================================
  let toastTimer = null;
  window.showToast = function (msg) {
    const toast = document.getElementById("toastMessage");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  };

  // ==========================================
  // 4. Panel & Modal Controllers
  // ==========================================
  window.toggleSharePanel = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const panel = document.getElementById("sharePanel");
    if (!panel) return;

    const isClosed =
      panel.hasAttribute("hidden") ||
      panel.style.display === "none" ||
      !panel.classList.contains("active");

    if (isClosed) {
      window.openSharePanel();
    } else {
      window.closeSharePanel();
    }
  };

  window.openSharePanel = function () {
    const panel = document.getElementById("sharePanel");
    if (!panel) return;
    panel.removeAttribute("hidden");
    panel.classList.add("active");
    panel.style.display = "block";

    const input = document.getElementById("customNameInput");
    if (input) {
      setTimeout(() => input.focus(), 50);
    }
  };

  window.closeSharePanel = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const panel = document.getElementById("sharePanel");
    if (!panel) return;
    panel.setAttribute("hidden", "");
    panel.classList.remove("active");
    panel.style.display = "none";
  };

  window.openContactModal = function () {
    const modal = document.getElementById("contactModal");
    if (!modal) return;
    modal.removeAttribute("hidden");
    modal.classList.add("active");
    modal.style.display = "flex";
  };

  window.closeContactModal = function () {
    const modal = document.getElementById("contactModal");
    if (!modal) return;
    modal.setAttribute("hidden", "");
    modal.classList.remove("active");
    modal.style.display = "none";
  };

  window.addToGoogleCalendar = function () {
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT_INFO.title)}&dates=${EVENT_INFO.startDate}/${EVENT_INFO.endDate}&details=${encodeURIComponent("Đến chung vui và chia sẻ niềm hạnh phúc cùng mình trong buổi lễ tốt nghiệp nhé! Sự hiện diện của bạn là món quà ý nghĩa nhất!")}&location=${encodeURIComponent(EVENT_INFO.location)}`;
    window.open(calUrl, "_blank", "noopener,noreferrer");
    window.showToast("📅 Đang mở Google Calendar...");
  };

  window.openGoogleMaps = function () {
    window.open(EVENT_INFO.mapsUrl, "_blank", "noopener,noreferrer");
    window.showToast("📍 Đang mở chỉ đường Google Maps...");
  };

  window.copyPhoneNumber = function () {
    copyToClipboard(EVENT_INFO.phone)
      .then(() => {
        window.showToast("📋 Đã sao chép số điện thoại: " + EVENT_INFO.phone);
        const copyPhoneStatus = document.getElementById("copyPhoneStatus");
        if (copyPhoneStatus) {
          copyPhoneStatus.textContent = "Đã sao chép! ✓";
          setTimeout(() => {
            copyPhoneStatus.textContent = EVENT_INFO.phone;
          }, 2000);
        }
      })
      .catch(() => {
        window.showToast("Số điện thoại: " + EVENT_INFO.phone);
      });
  };

  window.copyShareUrl = function () {
    const shareUrlDisplay = document.getElementById("shareUrlDisplay");
    if (!shareUrlDisplay) return;

    copyToClipboard(shareUrlDisplay.value)
      .then(() => {
        window.showToast("📋 Đã sao chép link mời!");
      })
      .catch(() => {
        shareUrlDisplay.select();
        window.showToast("Nhấn Ctrl+C để sao chép link");
      });
  };

  window.applyCustomName = function () {
    const input = document.getElementById("customNameInput");
    if (!input) return;
    const val = input.value.trim();
    if (val) {
      window.setGuestName(val, true);
      window.showToast("✨ Đã cập nhật thiệp: " + val);
      window.launchConfetti();
    }
  };

  // ==========================================
  // 5. Confetti Animation (Canvas)
  // ==========================================
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let particles = [];
  let animId = null;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const CONFETTI_COLORS = [
    "#ef4444",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ec4899",
    "#8b5cf6",
    "#fbbf24",
    "#ffffff",
  ];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.color =
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.size = Math.random() * 8 + 6;
      this.speedX = (Math.random() - 0.5) * 14;
      this.speedY = Math.random() * -12 - 4;
      this.gravity = 0.35;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 12;
      this.opacity = 1;
      this.isCap = Math.random() < 0.15;
    }

    update() {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      if (canvas && this.y > canvas.height * 0.7) {
        this.opacity -= 0.015;
      }
    }

    draw() {
      if (!ctx || this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      if (this.isCap) {
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size, 0);
        ctx.lineTo(0, this.size / 2);
        ctx.lineTo(-this.size, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      }

      ctx.restore();
    }
  }

  window.launchConfetti = function (originX, originY) {
    if (!canvas) return;
    const x = originX !== undefined ? originX : window.innerWidth / 2;
    const y = originY !== undefined ? originY : window.innerHeight * 0.45;

    for (let i = 0; i < 90; i++) {
      particles.push(new Particle(x, y));
    }

    if (!animId) {
      runAnimation();
    }
  };

  function runAnimation() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.opacity <= 0 || p.y > canvas.height + 50) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animId = requestAnimationFrame(runAnimation);
    } else {
      cancelAnimationFrame(animId);
      animId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ==========================================
  // 6. DOM Initialization & Event Setup
  // ==========================================
  async function init() {
    // 0. Load customer.json
    await loadCustomers();

    // 1. Initial Guest Name
    const rawSlug = getSlugFromUrl() || "Nguyễn Văn A";
    window.setGuestName(rawSlug, false);

    const customNameInput = document.getElementById("customNameInput");
    if (customNameInput) {
      const match = findCustomer(rawSlug);
      customNameInput.value = match ? match.name : rawSlug;
      customNameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          window.applyCustomName();
        }
      });
    }

    // 2. Button Event Listeners
    const fabToggle = document.getElementById("fabToggle");
    if (fabToggle) fabToggle.addEventListener("click", window.toggleSharePanel);

    const closePanelBtn = document.getElementById("closePanelBtn");
    if (closePanelBtn)
      closePanelBtn.addEventListener("click", window.closeSharePanel);

    const applyNameBtn = document.getElementById("applyNameBtn");
    if (applyNameBtn)
      applyNameBtn.addEventListener("click", window.applyCustomName);

    const copyUrlBtn = document.getElementById("copyUrlBtn");
    if (copyUrlBtn) copyUrlBtn.addEventListener("click", window.copyShareUrl);

    const celebrateBtn = document.getElementById("celebrateBtn");
    if (celebrateBtn)
      celebrateBtn.addEventListener("click", () => {
        window.launchConfetti();
        window.showToast("🎉 Chúc mừng Lễ Tốt Nghiệp!");
      });

    // 3. Quick Tag Chips from customer.json
    const quickTagsContainer = document.querySelector(".quick-tags");
    if (quickTagsContainer && customersData.length > 0) {
      quickTagsContainer.innerHTML =
        '<span class="tag-title">Khách mời trong danh sách:</span>';
      customersData.forEach((c) => {
        const btn = document.createElement("button");
        btn.className = "tag-chip";
        btn.dataset.name = c.name;
        btn.dataset.slug = c.slug;
        btn.textContent = `${c.name}`;
        btn.title = `Slug: ${c.slug}`;
        btn.addEventListener("click", () => {
          if (customNameInput) customNameInput.value = c.name;
          window.setGuestName(c.slug || c.name, true);
          window.showToast("✨ Đã chọn: " + c.name);
          window.launchConfetti();
        });
        quickTagsContainer.appendChild(btn);
      });
    }

    // 4. Sticky Notes Handlers
    const noteTimeDesktop = document.getElementById("noteTimeDesktop");
    const noteTimeMobile = document.getElementById("noteTimeMobile");
    if (noteTimeDesktop)
      noteTimeDesktop.addEventListener("click", window.addToGoogleCalendar);
    if (noteTimeMobile)
      noteTimeMobile.addEventListener("click", window.addToGoogleCalendar);

    const noteLocationDesktop = document.getElementById("noteLocationDesktop");
    const noteLocationMobile = document.getElementById("noteLocationMobile");
    if (noteLocationDesktop)
      noteLocationDesktop.addEventListener("click", window.openGoogleMaps);
    if (noteLocationMobile)
      noteLocationMobile.addEventListener("click", window.openGoogleMaps);

    const noteContactDesktop = document.getElementById("noteContactDesktop");
    const noteContactMobile = document.getElementById("noteContactMobile");
    if (noteContactDesktop)
      noteContactDesktop.addEventListener("click", window.openContactModal);
    if (noteContactMobile)
      noteContactMobile.addEventListener("click", window.openContactModal);

    // 5. Contact Modal
    const closeModalBtn = document.getElementById("closeModalBtn");
    if (closeModalBtn)
      closeModalBtn.addEventListener("click", window.closeContactModal);

    const contactModal = document.getElementById("contactModal");
    if (contactModal) {
      contactModal.addEventListener("click", (e) => {
        if (e.target === contactModal) window.closeContactModal();
      });
    }

    const copyPhoneModalBtn = document.getElementById("copyPhoneModalBtn");
    if (copyPhoneModalBtn)
      copyPhoneModalBtn.addEventListener("click", window.copyPhoneNumber);

    // 6. Character Avatars
    const boyDesktop = document.getElementById("boyDesktop");
    if (boyDesktop) {
      boyDesktop.addEventListener("click", () => {
        const rect = boyDesktop.getBoundingClientRect();
        window.launchConfetti(
          rect.left + rect.width / 2,
          rect.top + rect.height / 3,
        );
        window.showToast("🎓 Chúc mừng Tân Cử Nhân!");
      });
    }
    const boyMobile = document.getElementById("boyMobile");
    if (boyMobile) {
      boyMobile.addEventListener("click", () => {
        const rect = boyMobile.getBoundingClientRect();
        window.launchConfetti(
          rect.left + rect.width / 2,
          rect.top + rect.height / 3,
        );
        window.showToast("🎓 Chúc mừng Tân Cử Nhân!");
      });
    }

    // 7. Click Outside To Close Share Panel
    document.addEventListener("click", (e) => {
      const sharePanel = document.getElementById("sharePanel");
      const fabBtn = document.getElementById("fabToggle");
      if (
        !sharePanel ||
        sharePanel.hasAttribute("hidden") ||
        sharePanel.style.display === "none"
      ) {
        return;
      }
      if (!sharePanel.contains(e.target) && !fabBtn.contains(e.target)) {
        window.closeSharePanel();
      }
    });

    // 8. Escape Key Closes Modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        window.closeSharePanel();
        window.closeContactModal();
      }
    });

    // 9. Initial Confetti
    setTimeout(() => {
      window.launchConfetti();
    }, 600);
  }

  // Ensure DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
