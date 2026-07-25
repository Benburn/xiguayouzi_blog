(function () {
  "use strict";

  if (new URLSearchParams(location.search).get("render") === "1") {
    document.documentElement.classList.add("render-mode");
  }

  var button = document.getElementById("export-current");
  var select = document.getElementById("export-dpi");
  var status = document.getElementById("export-status");
  if (!button || !select || !status || typeof html2canvas !== "function") return;

  var exportFont = '"XY Poster Sans", "PingFang SC", "Microsoft YaHei", sans-serif';

  function writeU32(view, offset, value) {
    view.setUint32(offset, value >>> 0, false);
  }

  function crc32(bytes) {
    var table = crc32.table;
    if (!table) {
      table = crc32.table = new Uint32Array(256);
      for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        table[n] = c >>> 0;
      }
    }
    var crc = 0xffffffff;
    for (var i = 0; i < bytes.length; i++) crc = table[(crc ^ bytes[i]) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makePhysChunk(dpi) {
    var ppm = Math.round(dpi / 0.0254);
    var chunk = new Uint8Array(21);
    var view = new DataView(chunk.buffer);
    writeU32(view, 0, 9);
    chunk.set([112, 72, 89, 115], 4);
    writeU32(view, 8, ppm);
    writeU32(view, 12, ppm);
    chunk[16] = 1;
    writeU32(view, 17, crc32(chunk.slice(4, 17)));
    return chunk;
  }

  async function withDpi(blob, dpi) {
    var source = new Uint8Array(await blob.arrayBuffer());
    var parts = [source.slice(0, 8)];
    var offset = 8;
    var inserted = false;
    while (offset < source.length) {
      var view = new DataView(source.buffer, source.byteOffset + offset, 4);
      var length = view.getUint32(0, false);
      var end = offset + 12 + length;
      var type = String.fromCharCode.apply(null, source.slice(offset + 4, offset + 8));
      if (type !== "pHYs") parts.push(source.slice(offset, end));
      if (type === "IHDR" && !inserted) {
        parts.push(makePhysChunk(dpi));
        inserted = true;
      }
      offset = end;
    }
    return new Blob(parts, { type: "image/png" });
  }

  function cleanName(value) {
    return (value || "华斌超声知识海报").replace(/[\\/:*?"<>|]/g, "_");
  }

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle("error", Boolean(isError));
  }

  function dimensions(dpi) {
    return Math.round(810 * dpi / 96) + "×" + Math.round(1080 * dpi / 96);
  }

  select.addEventListener("change", function () {
    setStatus("PNG · " + dimensions(Number(select.value) || 300), false);
  });

  button.addEventListener("click", async function () {
    var slide = document.querySelector(".deck > .slide.is-active");
    if (!slide) return;

    var dpi = Number(select.value) || 300;
    var scale = dpi / 96;
    var pageBackground = getComputedStyle(slide).backgroundColor;
    if (!pageBackground || pageBackground === "transparent" || pageBackground === "rgba(0, 0, 0, 0)") {
      pageBackground = "#fffaf4";
    }
    var imageStates = Array.from(slide.querySelectorAll(".zoom-frame img")).map(function (image) {
      return {
        transform: image.style.transform,
        transformOrigin: image.style.transformOrigin,
        objectPosition: image.style.objectPosition
      };
    });

    button.disabled = true;
    setStatus("正在生成…", false);

    try {
      if (document.fonts) {
        await document.fonts.load('700 32px "XY Poster Sans"', "华斌超声知识海报全集");
        await document.fonts.ready;
      }

      var images = Array.from(slide.querySelectorAll("img"));
      await Promise.all(images.map(function (image) {
        if (image.complete && image.naturalWidth > 0) return image.decode ? image.decode().catch(function () {}) : Promise.resolve();
        return new Promise(function (resolve) {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      }));

      var canvas = await html2canvas(slide, {
        scale: scale,
        width: 810,
        height: 1080,
        windowWidth: 810,
        windowHeight: 1080,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: pageBackground,
        logging: false,
        useCORS: true,
        allowTaint: false,
        onclone: async function (clonedDocument) {
          clonedDocument.documentElement.classList.add("render-mode");
          var style = clonedDocument.createElement("style");
          style.textContent =
            'html,body,.deck{background:' + pageBackground + '!important}' +
            '.deck{width:810px!important;height:1080px!important;transform:none!important}' +
            '.deck>.slide.is-active{position:absolute!important;inset:0!important;opacity:1!important;transform:none!important;border-radius:0!important;background-color:' + pageBackground + '!important}' +
            '.deck>.slide.is-active,.deck>.slide.is-active *{font-family:' + exportFont + '!important}';
          clonedDocument.head.appendChild(style);

          var clonedSlide = clonedDocument.querySelector(".deck > .slide.is-active");
          if (clonedSlide) {
            Array.from(clonedSlide.querySelectorAll(".zoom-frame img")).forEach(function (image, index) {
              var state = imageStates[index];
              if (!state) return;
              image.style.transform = state.transform;
              image.style.transformOrigin = state.transformOrigin;
              image.style.objectPosition = state.objectPosition;
            });
          }
          if (clonedDocument.fonts) await clonedDocument.fonts.ready;
        },
        ignoreElements: function (element) {
          return element.hasAttribute("data-html2canvas-ignore") ||
            (element.classList && element.classList.contains("toc-home"));
        }
      });

      var rawBlob = await new Promise(function (resolve) { canvas.toBlob(resolve, "image/png"); });
      if (!rawBlob) throw new Error("浏览器未能生成PNG");
      var blob = await withDpi(rawBlob, dpi);
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = cleanName(slide.dataset.title) + "_调整后_" + dpi + "DPI.png";
      link.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      setStatus(canvas.width + "×" + canvas.height + " · 已导出调整后效果", false);
    } catch (error) {
      console.error(error);
      setStatus("导出失败，请稍后重试", true);
    } finally {
      button.disabled = false;
    }
  });

  setStatus("PNG · " + dimensions(Number(select.value) || 300), false);
})();
