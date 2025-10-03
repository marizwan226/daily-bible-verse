import React, { useState } from "react";
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

export default function SpecificVerse() {
  const [book, setBook] = useState("John");
  const [chapter, setChapter] = useState("3");
  const [verseNum, setVerseNum] = useState("16");
  const [result, setResult] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function fetchVerse() {
    setLoading(true);
    setErr(null);
    setResult(null);
    const passage = `${book} ${chapter}:${verseNum}`; // example: John 3:16
    const url = `${API_BASE}passage=${encodeURIComponent(passage)}&type=json`;
    try {
      const data = await fetchJSON(url);
      setResult(data?.[0] ?? null);
    } catch (e) {
      // JSONP fallback
      try {
        const data = await fetchJSONP(url);
        setResult(data?.[0] ?? null);
      } catch (e2: any) {
        setErr("Could not fetch verse (network or CORS). See console.");
        console.error(e2);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2>Get a Specific Verse</h2>
      <div className="form-row">
        <input value={book} onChange={(e)=>setBook(e.target.value)} placeholder="Book (e.g. John)" />
        <input value={chapter} onChange={(e)=>setChapter(e.target.value)} placeholder="Chapter" />
        <input value={verseNum} onChange={(e)=>setVerseNum(e.target.value)} placeholder="Verse" />
        <button className="btn" onClick={fetchVerse} disabled={loading}>
          Get Verse
        </button>
      </div>

      {loading && <div className="hint">Loading...</div>}
      {err && <div className="error">{err}</div>}
      {result && (
        <VerseCard
          book={result.bookname}
          chapter={result.chapter}
          verse={result.verse}
          text={result.text}
        />
      )}
    </section>
  );
}
