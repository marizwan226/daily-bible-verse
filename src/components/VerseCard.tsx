import React from "react";

type Props = {
  book?: string;
  chapter?: string | number;
  verse?: string | number;
  text?: string;
};

export default function VerseCard({ book, chapter, verse, text }: Props) {
  return (
    <div className="card">
      <div className="card-ref">
        <strong>{book} {chapter}:{verse}</strong>
      </div>
      <div className="card-text">{text}</div>
    </div>
  );
}
