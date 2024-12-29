import React, { useState } from 'react';
import './App.css';
import OpenAI from "openai";

// Utworzenie instancji OpenAI z użyciem API key
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,  // Pobieranie klucza API z pliku .env
});

function Gpt() {
  const [haiku, setHaiku] = useState(null); // stan do przechowywania odpowiedzi
  const [isLoading, setIsLoading] = useState(false); // stan do kontrolowania, czy zapytanie jest w toku

  const fetchHaiku = async () => {
    // Zabezpieczamy przed wielokrotnym wysyłaniem zapytań
    if (isLoading) return; // Jeśli zapytanie jest w toku, nie wykonuj nowego

    setIsLoading(true); // Ustawiamy stan na ładowanie, żeby zablokować dalsze zapytania

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Szukamy miejsca na fajne wakacje dla Polaka" },
          {
            role: "user",
            content: "Znajdź mi ciekawe miejsca do podróży w Europie w 2025 roku",
          },
        ],
      });
      // Zaktualizowanie stanu komponentu z otrzymanym haiku
    //   setHaiku(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching haiku:', error);
    } finally {
      setIsLoading(false); // Po zakończeniu zapytania, przywracamy stan ładowania
    }
  };

  return (
    <div className="App">
      <h1>Haiku about Recursion</h1>
      <button onClick={fetchHaiku} disabled={isLoading}>
        {isLoading ? "Loading..." : "Get Haiku"}
      </button>
      {haiku ? <p>{haiku}</p> : <p>Click the button to get a haiku!</p>}
    </div>
  );
}

export default Gpt;
