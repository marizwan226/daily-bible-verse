import React, { useEffect, useState } from "react";
import VerseCard from "./VerseCard";

type Verse = {
  bookname: string;
  chapter: string;
  verse: string;
  text: string;
};

const API_BASE = "https://labs.bible.org/api/?";

async function fetchJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// JSONP fallback (if CORS blocks fetch)
function fetchJSONP(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const cbName = "__bible_cb_" + Date.now();
    (window as any)[cbName] = (data: any) => {
      resolve(data);
      try { delete (window as any)[cbName]; } catch {}
      script.remove();
    };
    const script = document.createElement("script");
    script.src = url + (url.includes("?") ? "&" : "?") + "callback=" + cbName;
    script.onerror = () => {
      try { delete (window as any)[cbName]; } catch {}
      script.remove();
      reject(new Error("JSONP failed"));
    };
    document.body.appendChild(script);
  });
}

export default function RandomVerse() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadRandom() {
    setLoading(true);
    setErr(null);
    const url = `${API_BASE}passage=random&type=json`;
    try {
      const data = await fetchJSON(url);
      // data is an array; take first item
      setVerse(data?.[0] ?? null);
    } catch (e) {
      // try JSONP fallback
      try {
        const data = await fetchJSONP(url);
        setVerse(data?.[0] ?? null);
      } catch (e2: any) {
        setErr("Could not fetch a verse (network or CORS). See console.");
        console.error(e2);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadRandom(); }, []);

  return (
    <section className="panel">
      <h2>Random Verse</h2>
      {loading && <div className="hint">Loading...</div>}
      {err && <div className="error">{err}</div>}
      {verse ? (
        <VerseCard
          book={verse.bookname}
          chapter={verse.chapter}
          verse={verse.verse}
          text={verse.text}
        />
      ) : !loading ? <div className="hint">Click the button to load one.</div> : null}
      <div className="controls">
        <button className="btn" onClick={loadRandom} disabled={loading}>
          New Random Verse
        </button>
      </div>
    </section>
  );
}
