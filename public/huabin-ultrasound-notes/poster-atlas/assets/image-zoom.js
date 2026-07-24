(function () {
  "use strict";

  document.querySelectorAll(".zoom-frame").forEach(function (frame) {
    var image = frame.querySelector("img");
    if (!image) return;

    var state = { scale: 1, x: 0, y: 0, dragging: false, px: 0, py: 0 };
    var controls = document.createElement("div");
    controls.className = "zoom-controls";
    controls.setAttribute("data-html2canvas-ignore", "true");
    controls.innerHTML =
      '<button type="button" data-zoom="out" aria-label="缩小图片">−</button>' +
      '<button type="button" class="zoom-level" data-zoom="reset" aria-label="恢复图片大小">100%</button>' +
      '<button type="button" data-zoom="in" aria-label="放大图片">+</button>';
    frame.appendChild(controls);

    function apply() {
      image.style.transform = "translate(" + state.x + "px," + state.y + "px) scale(" + state.scale + ")";
      controls.querySelector(".zoom-level").textContent = Math.round(state.scale * 100) + "%";
      frame.classList.toggle("is-zoomed", state.scale > 1);
    }

    function change(delta) {
      state.scale = Math.max(0.5, Math.min(4, Math.round((state.scale + delta) * 4) / 4));
      if (state.scale <= 1) state.x = state.y = 0;
      apply();
    }

    controls.addEventListener("click", function (event) {
      event.stopPropagation();
      var action = event.target.getAttribute("data-zoom");
      if (action === "in") change(0.25);
      if (action === "out") change(-0.25);
      if (action === "reset") {
        state.scale = 1;
        state.x = state.y = 0;
        apply();
      }
    });

    image.addEventListener("dragstart", function (event) { event.preventDefault(); });
    image.addEventListener("pointerdown", function (event) {
      if (state.scale <= 1) return;
      state.dragging = true;
      state.px = event.clientX;
      state.py = event.clientY;
      image.setPointerCapture(event.pointerId);
      frame.classList.add("is-dragging");
    });
    image.addEventListener("pointermove", function (event) {
      if (!state.dragging) return;
      state.x += event.clientX - state.px;
      state.y += event.clientY - state.py;
      state.px = event.clientX;
      state.py = event.clientY;
      apply();
    });
    function stopDrag() {
      state.dragging = false;
      frame.classList.remove("is-dragging");
    }
    image.addEventListener("pointerup", stopDrag);
    image.addEventListener("pointercancel", stopDrag);
    apply();
  });
})();
