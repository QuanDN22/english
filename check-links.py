#!/usr/bin/env python3
"""Kiểm tra mọi link trong lo-trinh-data.js còn mở được không.

Chạy:  python3 check-links.py
- Video YouTube: kiểm tra qua oEmbed (video bị xóa/riêng tư sẽ báo lỗi).
- Trang web: kiểm tra mã HTTP.
- British Council chặn công cụ tự động, nên các link đó được liệt kê riêng để mở tay vài cái.
"""
import concurrent.futures as cf
import json
import re
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36"
BC = "https://learnenglish.britishcouncil.org/free-resources/"
BBC = "https://www.bbc.co.uk/learningenglish/english/features/"


def urls_from_data():
    src = Path(__file__).with_name("lo-trinh-data.js").read_text(encoding="utf-8")
    found = set(re.findall(r'"(https?://[^"]+)"', src))
    found |= {"https://www.youtube.com/watch?v=" + i for i in re.findall(r'yt\("([\w-]{11})"', src)}
    found |= {BC + p for p in re.findall(r'bc\("([^"]+)"', src)}
    found |= {BBC + p for p in re.findall(r'six\("([^"]+)"', src)}
    found |= {BBC + "pronunciation/tims-pronunciation-workshop-ep-" + n for n in re.findall(r"tim\((\d+),", src)}
    return sorted(u for u in found if u not in (BC, BBC, "https://www.youtube.com/watch?v="))


def fetch_status(url, tries=3):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=25) as r:
                return r.status, r.read(200000).decode("utf-8", "ignore")
        except urllib.error.HTTPError as e:
            return e.code, ""
        except Exception as e:  # mạng chập chờn: thử lại
            err = type(e).__name__
    return err, ""


def check(url):
    if "youtube.com/watch" in url:
        status, body = fetch_status("https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(url, safe=""))
        return url, status == 200, json.loads(body)["title"] if status == 200 else f"video không tồn tại ({status})"
    status, _ = fetch_status(url)
    return url, status == 200, str(status)


def main():
    urls = urls_from_data()
    manual = [u for u in urls if "britishcouncil.org" in u]
    auto = [u for u in urls if u not in manual]
    print(f"Kiểm tra {len(auto)} link tự động...")
    with cf.ThreadPoolExecutor(8) as ex:
        bad = [(u, why) for u, ok, why in ex.map(check, auto) if not ok]
    for u, why in bad:
        print(f"  LỖI  {why}  {u}")
    print(f"Xong: {len(auto) - len(bad)}/{len(auto)} link mở được.")
    print(f"\n{len(manual)} link British Council cần mở bằng trình duyệt (ví dụ 3 link đầu):")
    for u in manual[:3]:
        print("  " + u)


if __name__ == "__main__":
    main()
