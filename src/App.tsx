import React from "react";
import RandomVerse from "./components/RandomVerse";
import SpecificVerse from "./components/SpecificVerse";

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Bible Verse Finder</h1>
        <p className="subtitle">Random verse or look up any verse (e.g. John 3:16)</p>
      </header>

      <main className="main">
        <RandomVerse />
        <SpecificVerse />
      </main>

      <footer className="footer">
        <small>Data: labs.bible.org (NET Bible API)</small>
      </footer>
    </div>
  );
}
