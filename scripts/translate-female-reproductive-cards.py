#!/usr/bin/env python3
"""Build the bilingual layer for the female reproductive ultrasound cards.

The English source HTML remains untouched in a hidden/visible language panel.
Chinese translations are cached by exact source string so a later rebuild only
needs to translate newly added source text.
"""

from __future__ import annotations

import argparse
import copy
import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from bs4 import BeautifulSoup, NavigableString


PROJECT_ROOT = Path(__file__).resolve().parents[1]
CARDS_DIR = PROJECT_ROOT / "public" / "female-reproductive-ultrasound-cards"
SOURCE_CARDS_DIR = Path(r"E:\Book2Know\Us-Female Reproductive System\cards_output")
CACHE_PATH = PROJECT_ROOT / "scripts" / "female-reproductive-translations.json"
MODEL = "google/gemma-4-e4b"
API_URL = "http://192.168.31.70:1234/v1/chat/completions"

SYSTEM_PROMPT = (
    "You are a rigorous English-to-Simplified-Chinese translator for an "
    "obstetric and gynecologic ultrasound textbook. Translate every numbered "
    "segment FROM ENGLISH TO SIMPLIFIED CHINESE. Keep every [[[number]]] marker "
    "unchanged. Each output segment must contain only the faithful Chinese "
    "translation of its matching input. Never add explanations, Pinyin, English "
    "repetitions, diagnoses, examples, or facts absent from the source. Preserve "
    "Chinese medical terms already present, numbers, units, abbreviations, figure "
    "numbers, table numbers, and mathematical expressions exactly."
)

# Protect high-risk terminology before inference. Existing Chinese terms are
# explicitly preserved by the model, which avoids plausible but incorrect
# translations such as translating "junctional zone" as a cervical structure.
GLOSSARY = {
    "4D HyCoS_{y}": "四维子宫输卵管超声造影（4D HyCoSy）",
    "4D HyCoS $ _y $": "四维子宫输卵管超声造影（4D HyCoSy）",
    "4D HyCoSy": "四维子宫输卵管超声造影（4D HyCoSy）",
    "HyCoS_{y}": "子宫输卵管超声造影（HyCoSy）",
    "HyCoS $ _y $": "子宫输卵管超声造影（HyCoSy）",
    "HyCoSy": "子宫输卵管超声造影（HyCoSy）",
    "SIS": "生理盐水灌注超声（SIS）",
    "three-dimensional power Doppler ultrasound": "三维能量多普勒超声",
    "three-dimensional ultrasound": "三维超声",
    "contrast-enhanced ultrasound": "超声造影",
    "transvaginal ultrasonography": "经阴道超声检查",
    "transvaginal ultrasound": "经阴道超声",
    "transabdominal ultrasound": "经腹超声",
    "color Doppler flow imaging": "彩色多普勒血流成像（CDFI）",
    "power Doppler imaging": "能量多普勒成像",
    "spectral Doppler": "频谱多普勒",
    "Doppler ultrasound": "多普勒超声",
    "ultrasonography": "超声检查",
    "ultrasound examination": "超声检查",
    "ultrasound": "超声",
    "junctional zone": "子宫结合带（JZ）",
    "mid-sagittal plane": "正中矢状切面",
    "coronal plane": "冠状切面",
    "transverse plane": "横切面",
    "sagittal plane": "矢状切面",
    "uterine fibroids": "子宫肌瘤",
    "uterine fibroid": "子宫肌瘤",
    "uterine myomas": "子宫肌瘤",
    "uterine myoma": "子宫肌瘤",
    "leiomyomas": "子宫平滑肌瘤",
    "leiomyoma": "子宫平滑肌瘤",
    "adenomyosis": "子宫腺肌病",
    "adenomyoma": "子宫腺肌瘤",
    "endometrial polyp": "子宫内膜息肉",
    "endometrial receptivity": "子宫内膜容受性",
    "endometrial thickness": "子宫内膜厚度",
    "endometrium": "子宫内膜",
    "myometrium": "子宫肌层",
    "perimetrium": "子宫浆膜",
    "uterine cavity": "宫腔",
    "uterine artery": "子宫动脉",
    "uterus": "子宫",
    "cervical canal": "宫颈管",
    "cervix": "宫颈",
    "fallopian tubes": "输卵管",
    "fallopian tube": "输卵管",
    "hydrosalpinx": "输卵管积水",
    "tubo-ovarian abscess": "输卵管卵巢脓肿",
    "pelvic inflammatory disease": "盆腔炎性疾病",
    "polycystic ovary syndrome": "多囊卵巢综合征（PCOS）",
    "polycystic ovarian morphology": "多囊卵巢形态（PCOM）",
    "ovarian reserve": "卵巢储备",
    "ovarian artery": "卵巢动脉",
    "ovarian volume": "卵巢体积",
    "ovarian cyst": "卵巢囊肿",
    "ovarian tumor": "卵巢肿瘤",
    "borderline tumor": "交界性肿瘤",
    "subcapsular": "包膜下",
    "honeycomb-like": "蜂窝状",
    "solid papillary projections": "实性乳头状突起",
    "multilocular mixed cystic-solid tumors": "多房性囊实性混合肿瘤",
    "ovaries": "卵巢",
    "ovary": "卵巢",
    "antral follicle count": "窦卵泡计数（AFC）",
    "dominant follicle": "优势卵泡",
    "preovulatory follicle": "排卵前卵泡",
    "primordial follicle": "始基卵泡",
    "corpus luteum": "黄体",
    "follicles": "卵泡",
    "follicle": "卵泡",
    "oocyte retrieval": "取卵术",
    "embryo transfer": "胚胎移植",
    "ectopic pregnancy": "异位妊娠",
    "cesarean scar pregnancy": "剖宫产瘢痕妊娠",
    "interstitial pregnancy": "输卵管间质部妊娠",
    "cervical pregnancy": "宫颈妊娠",
    "gestational sac": "孕囊",
    "yolk sac": "卵黄囊",
    "fetal pole": "胚芽",
    "crown-rump length": "头臀长（CRL）",
    "miscarriage": "流产",
    "early pregnancy": "早期妊娠",
    "hypoechoic": "低回声",
    "hyperechoic": "高回声",
    "anechoic": "无回声",
    "echogenicity": "回声",
    "well-circumscribed": "边界清楚",
    "vascularity": "血流信号",
    "blood flow": "血流",
    "resistance index": "阻力指数（RI）",
    "pulsatility index": "搏动指数（PI）",
    "peak systolic velocity": "收缩期峰值流速（PSV）",
    "end-diastolic velocity": "舒张末期流速（EDV）",
    "systolic-diastolic ratio": "收缩期/舒张期比值（S/D）",
    "mean blood velocity": "平均血流速度",
    "saline infusion sonography": "生理盐水灌注超声（SIS）",
    "hysterosalpingo-contrast sonography": "子宫输卵管超声造影（HyCoSy）",
}

SKIP_PARENTS = {"script", "style", "code", "kbd", "samp"}
MARKER_RE = re.compile(r"\[\[\[(\d+)\]\]\]\s*(.*?)(?=\s*\[\[\[\d+\]\]\]|\s*\Z)", re.S)
LATIN_RE = re.compile(r"[A-Za-z]{2}")
CHINESE_RE = re.compile(r"[\u3400-\u9fff]")


def normalize_text(value: str) -> str:
    return " ".join(value.split())


def needs_translation(value: str) -> bool:
    if len(value) < 2 or not LATIN_RE.search(value):
        return False
    chinese_count = len(CHINESE_RE.findall(value))
    latin_count = len(re.findall(r"[A-Za-z]", value))
    natural_words = [
        word
        for word in re.findall(r"\b[A-Za-z]{3,}\b", value)
        if not word.isupper() and word.lower() not in {"pdf"}
    ]
    # Keep Chinese UI notes that only contain abbreviations such as PDF, MRI,
    # PI or RI, as well as formula-only lines, out of the translation queue.
    return bool(natural_words) and (chinese_count == 0 or latin_count > chinese_count)


def protect_terms(value: str) -> str:
    protected = value
    placeholders: dict[str, str] = {}
    for index, english in enumerate(sorted(GLOSSARY, key=len, reverse=True)):
        placeholder = f"⟪MEDTERM{index:03d}⟫"

        def replace_match(_match, token=placeholder, chinese=GLOSSARY[english]):
            placeholders[token] = chinese
            return token

        protected = re.sub(
            rf"(?<![A-Za-z]){re.escape(english)}(?![A-Za-z])",
            replace_match,
            protected,
            flags=re.I,
        )
    for placeholder, chinese in placeholders.items():
        protected = protected.replace(placeholder, chinese)
    return protected


def load_cache() -> dict[str, str]:
    if not CACHE_PATH.exists():
        return {}
    return json.loads(CACHE_PATH.read_text(encoding="utf-8"))


def save_cache(cache: dict[str, str]) -> None:
    temporary = CACHE_PATH.with_suffix(".tmp")
    temporary.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8",
    )
    temporary.replace(CACHE_PATH)


def apply_cache_corrections(cache: dict[str, str]) -> None:
    """Apply reviewed Chinese ultrasound terminology to model output."""
    replacements = (
        ("子宫颈流产妊娠", "宫颈异位妊娠"),
        ("子宫颈异位妊娠", "宫颈异位妊娠"),
        ("子宫颈妊娠", "宫颈妊娠"),
        ("隔膜子宫", "纵隔子宫"),
        ("子宫切开伤瘢痕", "剖宫产瘢痕"),
        ("子宫切开伤疤", "剖宫产瘢痕"),
        ("子宫切开瘢痕", "剖宫产瘢痕"),
        ("子宫切口瘢痕", "剖宫产瘢痕"),
        ("子宫疤痕", "剖宫产瘢痕"),
        ("子宫内膜下肌瘤", "黏膜下肌瘤"),
        ("肌层内平滑肌瘤", "肌壁间肌瘤"),
        ("透明质酸变性", "玻璃样变性"),
        ("角膜妊娠", "宫角妊娠"),
        ("脉搏指数（PI）", "搏动指数（PI）"),
        ("试管婴儿", "体外受精"),
        ("月白体", "白体"),
        ("濒临流产", "先兆流产"),
        ("威胁流产", "先兆流产"),
        ("早期胎死", "早期胚胎停育"),
        ("内宫颈管", "宫颈管"),
        ("宫颈内道", "宫颈管"),
        ("窦性卵泡", "窦卵泡"),
        ("色增强", "彩色增益"),
        ("巢隙", "瘢痕憩室"),
        ("胎儿处于中立位", "胎儿处于自然姿势"),
        ("对比液体", "造影剂"),
        ("对比剂", "造影剂"),
        ("对比模式", "造影模式"),
        ("对比检查", "造影检查"),
        ("临界性肿瘤", "交界性肿瘤"),
        ("月经初至", "下次月经来潮首日"),
        ("光谱超声", "频谱多普勒超声"),
        ("半月形子宫", "半侧子宫"),
        ("子宫内粘连", "宫腔粘连"),
        ("输精蛋部", "输卵管伞端"),
        ("直肠经超声", "经直肠超声"),
        ("周围胎膜血流", "滋养层周围血流"),
        ("蜕膜血流", "滋养层周围血流"),
        ("黄体囊用橙色圈出", "孕囊用橙色圈出"),
        ("宫内妊娠囊肿（CSP）", "剖宫产瘢痕妊娠（CSP）"),
        ("卵巢黄体囊肿（LUFS）", "未破裂卵泡黄素化综合征（LUFS）"),
        ("输卵管膨大部", "输卵管壶腹部"),
        ("角位妊娠", "宫角妊娠"),
        ("圆形韧带", "圆韧带"),
        ("宫管交界处", "子宫输卵管交界处"),
        ("血性腹膜液", "血性腹腔积液"),
        ("CDF I期", "CDFI显示"),
        ("异位（子宫内和异位妊娠共存）", "复合妊娠（宫内妊娠与异位妊娠并存）"),
        ("剖宫疤痕", "剖宫产瘢痕妊娠"),
        ("这是一种罕见的妊娠早植，胚胎植入于", "这是一种罕见的宫内妊娠，胚胎着床于"),
        ("该区域的增加可扩张性", "该区域较强的扩张能力"),
    )
    for source, original in list(cache.items()):
        corrected = original
        for old, new in replacements:
            corrected = corrected.replace(old, new)
        corrected = re.sub(r"(?<!经)阴道超声", "经阴道超声", corrected)
        corrected = re.sub(r"(?<!经)腹部超声", "经腹超声", corrected)
        corrected = re.sub(r"(?<!经)会阴超声", "经会阴超声", corrected)

        source_lower = source.lower()
        if "speculum" in source_lower:
            corrected = corrected.replace("阴道镜", "阴道窥器")
        if "hysteroscop" in source_lower:
            corrected = corrected.replace("阴道镜", "宫腔镜")
        if "theca lutein cyst" in source_lower:
            corrected = corrected.replace("皮质黄体囊肿", "卵泡膜黄素囊肿")
            corrected = corrected.replace("黄体囊肿", "卵泡膜黄素囊肿")
            corrected = corrected.replace("滋养层肿瘤", "妊娠滋养细胞疾病")
        if "peritrophoblastic" in source_lower:
            corrected = corrected.replace("周围胎膜血流", "滋养层周围血流")
            corrected = corrected.replace("蜕膜血流", "滋养层周围血流")
        if "gestational sac" in source_lower:
            corrected = corrected.replace("胎囊", "孕囊")
            corrected = corrected.replace("妊娠囊", "孕囊")
        if "luteinized unruptured follicle syndrome" in source_lower or "lufs" in source_lower:
            corrected = corrected.replace(
                "卵巢黄体囊肿（LUFS）", "未破裂卵泡黄素化综合征（LUFS）"
            )
        if source.startswith("HP "):
            corrected = corrected.replace(
                "子宫内膜异位妊娠（HP）", "复合妊娠（HP）"
            )
        if "lithotomy position" in source_lower:
            corrected = corrected.replace("分娩体位（lithotomy position）", "膀胱截石位")
            corrected = corrected.replace("分娩体位", "膀胱截石位")
            corrected = corrected.replace("位检位", "膀胱截石位")
            corrected = corrected.replace("患者采取位", "患者取膀胱截石位")
            corrected = corrected.replace("患者置于位", "患者取膀胱截石位")
            corrected = corrected.replace("采取位", "取膀胱截石位")
        if source == "4.3.1 Follicle Monitoring and Timing of Operation in IUI":
            corrected = "4.3.1 宫腔内人工授精（IUI）中的卵泡监测与操作时机"
        cache[source] = corrected
    save_cache(cache)


def collect_source_strings(files: list[Path]) -> list[str]:
    strings: dict[str, None] = {}
    for file in files:
        soup = BeautifulSoup(file.read_text(encoding="utf-8"), "lxml")
        for source_copy in soup.select(".source-copy"):
            for node in source_copy.find_all(string=True):
                if node.parent and node.parent.name in SKIP_PARENTS:
                    continue
                text = normalize_text(str(node))
                if needs_translation(text):
                    strings[text] = None
    return list(strings)


def make_batches(strings: list[str], max_chars: int = 500, max_items: int = 2):
    batch: list[str] = []
    char_count = 0
    for value in strings:
        projected = char_count + len(value)
        if batch and (projected > max_chars or len(batch) >= max_items):
            yield batch
            batch = []
            char_count = 0
        batch.append(value)
        char_count += len(value)
    if batch:
        yield batch


def split_long_text(value: str, max_chars: int = 280) -> list[str]:
    if len(value) <= max_chars:
        return [value]
    sentences = re.split(r"(?<=[.!?;])\s+(?=[A-Z0-9(])", value)
    parts: list[str] = []
    current = ""
    for sentence in sentences:
        if len(sentence) > max_chars:
            clauses = re.split(r"(?<=[,:])\s+", sentence)
        else:
            clauses = [sentence]
        for clause in clauses:
            if current and len(current) + 1 + len(clause) > max_chars:
                parts.append(current)
                current = clause
            else:
                current = f"{current} {clause}".strip()
    if current:
        parts.append(current)
    if len(parts) == 1 and len(parts[0]) > max_chars:
        words = parts[0].split()
        parts = []
        current = ""
        for word in words:
            if current and len(current) + 1 + len(word) > max_chars:
                parts.append(current)
                current = word
            else:
                current = f"{current} {word}".strip()
        if current:
            parts.append(current)
    return parts


def clean_translation(source: str, translation: str) -> str:
    value = translation.strip()
    # Remove a verbatim English repetition if the model appended it despite the
    # instruction. Medical abbreviations inside the Chinese sentence remain.
    if source in value:
        value = value.replace(f"({source})", "").replace(source, "").strip()
    value = re.sub(r"\n{3,}", "\n\n", value)
    if LATIN_RE.search(source) and not CHINESE_RE.search(value):
        raise ValueError(f"translation contains no Chinese: {source[:80]}")
    return value


def translate_batch(session: requests.Session, values: list[str], retries: int = 1) -> list[str]:
    if len(values) == 1 and len(values[0]) > 320:
        source = values[0]
        parts = split_long_text(source)
        if len(parts) > 1:
            translated_parts = [
                translate_batch(session, [part])[0] for part in parts
            ]
            return [" ".join(translated_parts)]
    protected = [protect_terms(value) for value in values]
    prompt = (
        "Translate the following numbered medical textbook segments FROM ENGLISH "
        "TO SIMPLIFIED CHINESE. Preserve every [[[number]]] marker exactly. "
        "Return only the markers and their translations in the same order.\n\n"
        + "\n".join(f"[[[{index}]]] {value}" for index, value in enumerate(protected))
    )
    payload = {
        "model": MODEL,
        "temperature": 0,
        "max_tokens": min(1200, max(180, int(sum(map(len, protected)) * 1.1))),
        "reasoning_effort": "none",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    }
    last_error: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            response = session.post(API_URL, json=payload, timeout=30)
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            matches = {int(index): text.strip() for index, text in MARKER_RE.findall(content)}
            if len(matches) != len(values) or any(index not in matches for index in range(len(values))):
                raise ValueError(
                    f"expected {len(values)} markers, received {len(matches)}"
                )
            return [
                clean_translation(values[index], matches[index])
                for index in range(len(values))
            ]
        except Exception as error:  # noqa: BLE001 - retry includes malformed model output
            last_error = error
            time.sleep(attempt * 2)
    if len(values) > 1:
        midpoint = len(values) // 2
        return translate_batch(session, values[:midpoint]) + translate_batch(
            session, values[midpoint:]
        )
    if len(values[0]) > 80:
        source = values[0]
        parts = split_long_text(source, max_chars=max(60, len(source) // 2))
        if len(parts) > 1:
            return [
                " ".join(translate_batch(session, [part])[0] for part in parts)
            ]
    raise RuntimeError(f"failed to translate: {values[0][:100]}") from last_error


def translate_missing(strings: list[str], cache: dict[str, str]) -> None:
    missing = [value for value in strings if value not in cache]
    # Some formula/caption fragments become fully Chinese after applying the
    # glossary. Cache them directly instead of asking the model to paraphrase a
    # mathematical expression.
    for value in list(missing):
        protected = protect_terms(value)
        remaining_words = [
            word
            for word in re.findall(r"\b[A-Za-z]{3,}\b", protected)
            if not word.isupper() and word.lower() not in {"fig", "table", "pdf"}
        ]
        if protected != value and not remaining_words:
            cache[value] = protected
            missing.remove(value)
    save_cache(cache)
    batches = list(make_batches(missing))
    print(
        f"Source strings: {len(strings)}; cached: {len(strings) - len(missing)}; "
        f"new: {len(missing)}; batches: {len(batches)}"
    , flush=True)
    if not missing:
        return

    def translate_worker(batch: list[str]) -> list[str]:
        with requests.Session() as session:
            return translate_batch(session, batch)

    completed = 0
    # LM Studio on the target machine processes one long generation reliably.
    # Multiple long requests can remain queued after a client disconnects, so
    # keep a single in-flight batch and rely on the persistent cache for speed.
    with ThreadPoolExecutor(max_workers=1) as executor:
        future_batches = {
            executor.submit(translate_worker, batch): batch for batch in batches
        }
        for future in as_completed(future_batches):
            batch = future_batches[future]
            translations = future.result()
            cache.update(zip(batch, translations, strict=True))
            save_cache(cache)
            completed += 1
            print(
                f"[{completed:03d}/{len(batches):03d}] "
                f"cached {len(cache)} translations"
            , flush=True)


def find_summary(file: Path) -> tuple[str, str]:
    source = SOURCE_CARDS_DIR / file.name
    if not source.exists():
        return (
            "本章按原书页面顺序呈现正文、图片和图注，便于结合中文译文与英文原文对照学习。",
            "This chapter follows the source page order for aligned study of text, figures, and captions.",
        )
    soup = BeautifulSoup(source.read_text(encoding="utf-8"), "lxml")
    cn = soup.select_one(".intro-cn")
    en = soup.select_one(".intro-en")
    return (
        normalize_text(cn.get_text(" ", strip=True)) if cn else "",
        normalize_text(en.get_text(" ", strip=True)) if en else "",
    )


def replace_text_nodes(container, cache: dict[str, str]) -> None:
    for node in list(container.find_all(string=True)):
        if node.parent and node.parent.name in SKIP_PARENTS:
            continue
        original = str(node)
        core = normalize_text(original)
        if core not in cache:
            continue
        leading = re.match(r"^\s*", original).group(0)
        trailing = re.search(r"\s*$", original).group(0)
        node.replace_with(NavigableString(f"{leading}{cache[core]}{trailing}"))


def make_language_switch(soup: BeautifulSoup):
    switch = soup.new_tag("span", attrs={"class": "lang-switch", "role": "group"})
    switch["aria-label"] = "切换本小节语言"
    for language, label, active in (("zh", "中文", True), ("en", "EN", False)):
        button = soup.new_tag("button", attrs={"type": "button", "data-lang": language})
        if active:
            button["class"] = ["active"]
            button["aria-pressed"] = "true"
        else:
            button["aria-pressed"] = "false"
        button.string = label
        switch.append(button)
    return switch


def make_global_switch(soup: BeautifulSoup):
    wrapper = soup.new_tag("div", attrs={"class": "global-language-switch"})
    label = soup.new_tag("span")
    label.string = "全文语言"
    wrapper.append(label)
    for language, text, active in (("zh", "中文译文", True), ("en", "English", False)):
        button = soup.new_tag(
            "button", attrs={"type": "button", "data-global-lang": language}
        )
        if active:
            button["class"] = ["active"]
            button["aria-pressed"] = "true"
        else:
            button["aria-pressed"] = "false"
        button.string = text
        wrapper.append(button)
    return wrapper


def make_summary(soup: BeautifulSoup, cn: str, en: str):
    aside = soup.new_tag("aside", attrs={"class": "chapter-summary"})
    heading = soup.new_tag("p", attrs={"class": "chapter-summary__label"})
    heading.string = "章节摘要 · SUMMARY"
    cn_paragraph = soup.new_tag("p", attrs={"class": "chapter-summary__cn", "lang": "zh-CN"})
    cn_paragraph.string = cn
    en_paragraph = soup.new_tag("p", attrs={"class": "chapter-summary__en", "lang": "en"})
    en_paragraph.string = en
    aside.extend([heading, cn_paragraph, en_paragraph])
    return aside


def build_bilingual_pages(files: list[Path], cache: dict[str, str]) -> None:
    for index, file in enumerate(files, 1):
        soup = BeautifulSoup(file.read_text(encoding="utf-8"), "lxml")
        body = soup.body
        if not body:
            raise ValueError(f"missing body: {file}")
        body["data-bilingual"] = "lm-studio-gemma-4-e4b"

        hero = soup.select_one(".topic-hero")
        english_title = soup.select_one(".english-title")
        source_note = soup.select_one(".source-note")
        if hero and english_title:
            summary_cn, summary_en = find_summary(file)
            english_title.insert_after(make_summary(soup, summary_cn, summary_en))
        if hero and source_note:
            source_note.string = (
                "正文提供中文辅助译文与英文原文切换；图片、图号、图注和 PDF "
                "页码始终按原书位置保留。译文用于学习理解，专业表述请同时核对英文原文。"
            )
            source_note.insert_after(make_global_switch(soup))

        for source_page in soup.select(".source-page"):
            source_copy = source_page.select_one(":scope > .source-copy")
            bar = source_page.select_one(":scope > .source-page__bar")
            if not source_copy or not bar:
                continue

            english_panel = copy.deepcopy(source_copy)
            english_panel["class"] = ["source-copy", "language-panel", "language-en"]
            english_panel["lang"] = "en"
            english_panel["hidden"] = ""

            chinese_panel = copy.deepcopy(source_copy)
            chinese_panel["class"] = ["source-copy", "language-panel", "language-zh"]
            chinese_panel["lang"] = "zh-CN"
            replace_text_nodes(chinese_panel, cache)

            source_copy.replace_with(chinese_panel)
            chinese_panel.insert_after(english_panel)

            link = bar.find("a", recursive=False)
            actions = soup.new_tag("span", attrs={"class": "source-page__actions"})
            actions.append(make_language_switch(soup))
            if link:
                actions.append(link.extract())
            bar.append(actions)

        file.write_text(str(soup), encoding="utf-8")
        print(
            f"Built bilingual page [{index:02d}/{len(files):02d}] {file.name}",
            flush=True,
        )


def update_index() -> None:
    file = CARDS_DIR / "index.html"
    soup = BeautifulSoup(file.read_text(encoding="utf-8"), "lxml")
    lead = soup.select_one(".index-lead")
    if lead:
        lead.string = (
            "面向中国超声学习者的中英双语图文版。31 个专题均提供中文辅助译文、"
            "英文原文、章节摘要和可直达的原书 PDF 页码。"
        )
    stats = soup.select_one(".index-stats")
    if stats:
        badge = soup.new_tag("span")
        strong = soup.new_tag("strong")
        strong.string = "中 / EN"
        badge.append(strong)
        badge.append(" 双语切换")
        stats.append(badge)
    file.write_text(str(soup), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--build-only",
        action="store_true",
        help="Use the existing cache and do not call LM Studio.",
    )
    args = parser.parse_args()

    files = sorted(path for path in CARDS_DIR.glob("*.html") if path.name != "index.html")
    if len(files) != 31:
        raise RuntimeError(f"expected 31 topic pages, found {len(files)}")

    cache = load_cache()
    strings = collect_source_strings(files)
    if not args.build_only:
        translate_missing(strings, cache)
    apply_cache_corrections(cache)
    missing = [value for value in strings if value not in cache]
    if missing:
        raise RuntimeError(
            f"translation cache is incomplete: {len(missing)} source strings missing"
        )

    build_bilingual_pages(files, cache)
    update_index()
    print(f"Done: 31 bilingual topics; {len(cache)} cached source translations.")


if __name__ == "__main__":
    main()
