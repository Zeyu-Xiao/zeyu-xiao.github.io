const updated = document.getElementById("last-updated");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (updated) {
  const raw = new Date(document.lastModified);
  updated.textContent = Number.isNaN(raw.getTime())
    ? new Date().toISOString().split("T")[0]
    : raw.toISOString().split("T")[0];
}

const revealElements = document.querySelectorAll(".reveal-on-scroll");

if (revealElements.length) {
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.88) {
        element.classList.add("is-visible");
        return;
      }

      revealObserver.observe(element);
    });
  }
}

document.querySelectorAll('.paper-preview[data-preview-type="video"]').forEach((preview) => {
  const video = preview.querySelector("video");
  if (!video) return;

  preview.addEventListener("mouseenter", () => {
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  });

  preview.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});
