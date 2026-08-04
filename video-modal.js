


document.addEventListener("DOMContentLoaded", () => {
  const previewButtons = document.querySelectorAll(".project-video-preview");
  const modal = document.querySelector("#project-video-modal");
  const modalVideo = document.querySelector("#project-modal-video");
  const modalTitle = document.querySelector("#project-video-modal-title");

  if (!previewButtons.length || !modal || !modalVideo || !modalTitle) return;

  const closeButton = modal.querySelector(".video-modal__close");
  const visibleVideos = new WeakSet();
  let activeButton = null;
  let activePreviewVideo = null;

  const playPreview = (video) => {
    video.muted = true;
    video.play().catch(() => {
      // Algunos navegadores pueden bloquear la reproducción automática.
    });
  };

  const previewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          visibleVideos.add(video);
          if (modal.hidden) playPreview(video);
        } else {
          visibleVideos.delete(video);
          video.pause();
        }
      });
    },
    { threshold: 0.35 },
  );

  previewButtons.forEach((button) => {
    const previewVideo = button.querySelector(".project-video");
    if (!previewVideo) return;

    previewVideo.muted = true;
    previewObserver.observe(previewVideo);

    button.addEventListener("click", () => {
      const videoSource = button.dataset.videoSrc;
      if (!videoSource) return;

      activeButton = button;
      activePreviewVideo = previewVideo;

      document
        .querySelectorAll(".project-video")
        .forEach((video) => video.pause());

      modalTitle.textContent =
        button.dataset.videoTitle || "Demostración del proyecto";
      modalVideo.src = videoSource;
      modalVideo.muted = false;
      modal.hidden = false;
      document.body.classList.add("video-modal-open");

      const startTime = previewVideo.currentTime;
      const startPlayback = () => {
        if (Number.isFinite(modalVideo.duration)) {
          modalVideo.currentTime = Math.min(
            startTime,
            Math.max(0, modalVideo.duration - 0.25),
          );
        }

        modalVideo.play().catch(() => {
          // Si el navegador no inicia el sonido, los controles quedan disponibles.
        });
      };

      if (modalVideo.readyState >= 1) {
        startPlayback();
      } else {
        modalVideo.addEventListener("loadedmetadata", startPlayback, {
          once: true,
        });
      }

      closeButton.focus();
    });
  });

  const closeModal = () => {
    if (modal.hidden) return;

    const modalTime = modalVideo.currentTime;
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
    modal.hidden = true;
    document.body.classList.remove("video-modal-open");

    if (activePreviewVideo) {
      if (
        Number.isFinite(activePreviewVideo.duration) &&
        activePreviewVideo.duration > 0
      ) {
        activePreviewVideo.currentTime =
          modalTime % activePreviewVideo.duration;
      }

      if (visibleVideos.has(activePreviewVideo))
        playPreview(activePreviewVideo);
    }

    activeButton?.focus();
    activeButton = null;
    activePreviewVideo = null;
  };

  modal.querySelectorAll("[data-video-modal-close]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      document
        .querySelectorAll(".project-video")
        .forEach((video) => video.pause());
      if (!modal.hidden) modalVideo.pause();
      return;
    }

    if (modal.hidden) {
      document.querySelectorAll(".project-video").forEach((video) => {
        if (visibleVideos.has(video)) playPreview(video);
      });
    }
  });
});