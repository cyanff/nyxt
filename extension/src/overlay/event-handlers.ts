export function getCloseHandler(overlay: HTMLElement): EventListener {
  const closeHandler = (e) => {
    e.preventDefault();
    overlay.style.display = "none";
  };
  return closeHandler;
}

export function getHandleHandler(overlay: HTMLElement): EventListener {
  const handleHandler = (e) => {
    e.preventDefault();

    const startX = e.clientX - overlay.offsetLeft;
    const startY = e.clientY - overlay.offsetTop;

    const onMouseMove = (e) => {
      overlay.style.left = e.clientX - startX + "px";
      overlay.style.top = e.clientY - startY + "px";
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return handleHandler;
}

export function getResizerHandler(overlay: HTMLElement): EventListener {
  const resizerHandler = (e) => {
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = parseInt(
      document.defaultView.getComputedStyle(overlay).width,
      10
    );
    const startHeight = parseInt(
      document.defaultView.getComputedStyle(overlay).height,
      10
    );

    // I don't know why, but if I don't add 1px to the overlay's position,
    // the overlay resizing will be inversed :<
    overlay.style.left = overlay.offsetLeft + 1 + "px";
    overlay.style.top = overlay.offsetTop + 1 + "px";

    const onMouseMove = (e) => {
      const height = startHeight + (e.clientY - startY);
      const width = startWidth + (e.clientX - startX);
      if (height > 350) {
        overlay.style.height = height + "px";
      }
      if (width > 350) {
        overlay.style.width = width + "px";
      }
    };
    document.addEventListener("mousemove", onMouseMove);

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mouseup", onMouseUp);
  };
  return resizerHandler;
}
