import React, { useEffect, useRef, useState } from "react";
import { Fretboard } from "@moonwave99/fretboard.js";
import Accordion from "./components/Accordion"; // Accordionコンポーネントをインポート

// コードのインターバル定義の型
interface ChordIntervals {
  [key: string]: string[];
}

export default function ScaleAndChords() {
  // フレットボードの描画用のref
  const fretboardRef = useRef<HTMLElement>(null);
  // スケール関連のstate（ローカルストレージから初期値を読み込む）
  const [scaleRoot, setScaleRoot] = useState(() => localStorage.getItem("scaleAndChordsScaleRoot") || "C");
  const [scaleType, setScaleType] = useState(() => localStorage.getItem("scaleAndChordsScaleType") || "ionian");
  // 選択されたコード進行のstate（ローカルストレージから初期値を読み込む）
  const [firstBar, setFirstBar] = useState(() => {
    const storedFirstBarRoot = localStorage.getItem("scaleAndChordsFirstBarRoot") || "G";
    const storedFirstBarChord = localStorage.getItem("scaleAndChordsFirstBarChord") || "7";
    return { root: storedFirstBarRoot, chord: storedFirstBarChord };
  });
  const [secondBar, setSecondBar] = useState(() => {
    const storedSecondBarRoot = localStorage.getItem("scaleAndChordsSecondBarRoot") || "C";
    const storedSecondBarChord = localStorage.getItem("scaleAndChordsSecondBarChord") || "Maj7";
    return { root: storedSecondBarRoot, chord: storedSecondBarChord };
  });
  // コードの表示状態を管理するstate
  const [visibleCode, setVisibleCode] = useState<'first' | 'second' | 'both'>('both');
  // 選択状態の画面表示用のstate（不要になる可能性あり、一旦残します）
  const [selectedValues, setSelectedValues] = useState({
    root: "C",
    chord: "Maj7",
  });

  // スケール関連のstateをローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("scaleAndChordsScaleRoot", scaleRoot);
  }, [scaleRoot]);

  useEffect(() => {
    localStorage.setItem("scaleAndChordsScaleType", scaleType);
  }, [scaleType]);

  // コード進行のstateをローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("scaleAndChordsFirstBarRoot", firstBar.root);
  }, [firstBar.root]);

  useEffect(() => {
    localStorage.setItem("scaleAndChordsFirstBarChord", firstBar.chord);
  }, [firstBar.chord]);

  useEffect(() => {
    localStorage.setItem("scaleAndChordsSecondBarRoot", secondBar.root);
  }, [secondBar.root]);

  useEffect(() => {
    localStorage.setItem("scaleAndChordsSecondBarChord", secondBar.chord);
  }, [secondBar.chord]);

  useEffect(() => {
    setSelectedValues({ root: `${firstBar.root}${firstBar.chord}`, chord: `${secondBar.root}${secondBar.chord}` });
  }, [firstBar, secondBar]);

  // コードの構成音を特定する関数
  const getChordTones = (root: string, chordType: string): string[] => {
    const notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    const intervals: ChordIntervals = {
      Maj7: ["1P", "3M", "5P", "7M"],
      m7: ["1P", "3m", "5P", "7m"],
      7: ["1P", "3M", "5P", "7m"],
      m7b5: ["1P", "3m", "5b", "7m"],
    };

    const rootIndex = notes.indexOf(root);
    const chordIntervals = intervals[chordType];

    if (!chordIntervals) {
      return []; // コードタイプが存在しない場合は空の配列を返す
    }

    return chordIntervals.map((interval: string) => {
      const degree = interval.slice(0, interval.length - 1);
      const alteration = interval.slice(interval.length - 1);
      let noteIndexOffset = 0;

      switch (degree) {
        case "1": noteIndexOffset = 0; break;
        case "2": noteIndexOffset = 2; break;
        case "3": noteIndexOffset = 4; break;
        case "4": noteIndexOffset = 5; break;
        case "5": noteIndexOffset = 7; break;
        case "6": noteIndexOffset = 9; break;
        case "7": noteIndexOffset = 11; break;
      }

      let adjustedIndex = (rootIndex + noteIndexOffset) % 12;
      if (adjustedIndex < 0) {
        adjustedIndex += 12;
      }
      let note = notes[adjustedIndex];

      switch (alteration) {
        case "b":
          note = notes[(adjustedIndex - 1 + 12) % 12];
          break;
        case "#":
          note = notes[(adjustedIndex + 1) % 12];
          break;
        case "m": // 短3度、短7度に対応
          if (degree === "3") {
            note = notes[(adjustedIndex - 1 + 12) % 12];
          } else if (degree === "7") {
            note = notes[(adjustedIndex - 1 + 12) % 12];
          }
          break;
        case "M": // 長3度、長7度に対応
          break;
        case "P": // Perfect
          break;
      }
      return note;
    });
  };

  useEffect(() => {
    if (fretboardRef.current) {
      fretboardRef.current.innerHTML = "";

      const fretboard = new Fretboard({
        el: fretboardRef.current,
        dotSize: 28,
        highlightFill: "whitesmoke",
        width: 960,
      });

      // スケールを描画
      fretboard.renderScale({
        root: scaleRoot,
        type: scaleType,
      });

      fretboard.style({
        text: ({ interval, note }: { interval: any; note: any }) =>
          interval + "/" + note,
        fontSize: 10,
      });

      // コードトーンを描画
      const firstBarChordTones = getChordTones(firstBar.root, firstBar.chord);
      const secondBarChordTones = getChordTones(secondBar.root, secondBar.chord);
      console.log("firstChord : " + firstBarChordTones);
      console.log("secondChord : " + secondBarChordTones);

      // 1小節目のコードトーンを赤色で表示
      if (visibleCode === 'first' || visibleCode === 'both') {
        firstBarChordTones.forEach((note: string) => {
          fretboard.style({
            filter: { note: note },
            fill: "#fca5a5", // ソフトな赤
          });
        });
      }

      // 2小節目のコードトーンを青色で表示
      if (visibleCode === 'second' || visibleCode === 'both') {
        secondBarChordTones.forEach((note: string) => {
          fretboard.style({
            filter: { note: note },
            fill: "#93c5fd", // ソフトな青
          });
        });
      }

      // 重複するコードトーンを特定し、紫色で表示
      if (visibleCode === 'both') {
        const overlappingNotes = firstBarChordTones.filter(note => secondBarChordTones.includes(note));
        overlappingNotes.forEach((note: string) => {
          fretboard.style({
            filter: { note: note },
            fill: "#c084fc", // ソフトな紫
          });
        });
      }

      console.log("rendered");
    }
  }, [fretboardRef.current, scaleRoot, scaleType, firstBar, secondBar, visibleCode]);

  // スケール関連のハンドラー
  const handleScaleRootChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setScaleRoot(event.target.value);
  };

  const handleScaleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setScaleType(event.target.value);
  };

  // 1小節目のルート音が変更されたときキックされる関数
  const handleFirstBarRootChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFirstBar((prev) => ({ ...prev, root: event.target.value }));
  };

  // 1小節目のコードが変更されたときキックされる関数
  const handleFirstBarChordChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFirstBar((prev) => ({ ...prev, chord: event.target.value }));
  };

  // 2小節目のルート音が変更されたときキックされる関数
  const handleSecondBarRootChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSecondBar((prev) => ({ ...prev, root: event.target.value }));
  };

  // 2小節目のコードが変更されたときキックされる関数
  const handleSecondBarChordChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSecondBar((prev) => ({ ...prev, chord: event.target.value }));
  };

  return (
    <>
      <div className="flex justify-center items-start mt-4 w-full max-w-screen-md mx-auto">
        <div className="w-full">

          <div className="text-center mt-4">
            <span>Scale: {scaleRoot} {scaleType}</span>
            <br />
            <span className='inline-block p-2 my-2 mx-2 rounded-md bg-red-100 shadow'>1st Chord: {firstBar.root} {firstBar.chord.replace(/_/g, "")}</span>
            <span className="inline-block p-2 my-2 mx-2 rounded-md bg-blue-100 shadow">2nd Chord: {secondBar.root} {secondBar.chord.replace(/_/g, "")}</span>
          </div>

          {/* コード表示切り替えボタン */}
          <div className="flex justify-center mt-4">
            <button
              className={`mx-2 px-4 py-2 rounded-md ${visibleCode === 'first' ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setVisibleCode('first')}
            >
              1st Chord
            </button>
            <button
              className={`mx-2 px-4 py-2 rounded-md ${visibleCode === 'second' ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setVisibleCode('second')}
            >
              2nd Chord
            </button>
            <button
              className={`mx-2 px-4 py-2 rounded-md ${visibleCode === 'both' ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setVisibleCode('both')}
            >
              Both Chords
            </button>
          </div>
          <div className="overflow-x-auto">
            <figure ref={fretboardRef} className="flex-none"></figure>
          </div>
          <Accordion title="Settings">
            <div>
              <div className="mb-4">
                <label className="mr-2">Scale Root:</label>
                <select
                  value={scaleRoot}
                  onChange={handleScaleRootChange}
                  className="text-gray-800 rounded-md border border-gray-500 focus:outline-none"
                >
                  <option value="C">C</option>
                  <option value="Db">Db/C#</option>
                  <option value="D">D</option>
                  <option value="Eb">Eb/D#</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="Gb">Gb/F#</option>
                  <option value="G">G</option>
                  <option value="Ab">Ab/G#</option>
                  <option value="A">A</option>
                  <option value="Bb">Bb/A#</option>
                  <option value="B">B</option>
                </select>
                <label className="mx-2">Scale Type:</label>
                <select
                  value={scaleType}
                  onChange={handleScaleTypeChange}
                  className="text-gray-800 rounded-md border border-gray-500 focus:outline-none"
                >
                  <option value="ionian">Major (Ionian)</option>
                  <option value="dorian">Dorian</option>
                  <option value="phrygian">Phrygian</option>
                  <option value="lydian">Lydian</option>
                  <option value="mixolydian">Mixolydian</option>
                  <option value="aeolian">Minor (Aeolian)</option>
                  <option value="locrian">Locrian</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="mr-2">1st Bar Root:</label>
                <select
                  value={firstBar.root}
                  onChange={handleFirstBarRootChange}
                  className="text-gray-800 rounded-md border border-gray-500 focus:outline-none"
                >
                  <option value="C">C</option>
                  <option value="Db">Db/C#</option>
                  <option value="D">D</option>
                  <option value="Eb">Eb/D#</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="Gb">Gb/F#</option>
                  <option value="G">G</option>
                  <option value="Ab">Ab/G#</option>
                  <option value="A">A</option>
                  <option value="Bb">Bb/A#</option>
                  <option value="B">B</option>
                </select>
                <label className="mx-2">Chord:</label>
                <select
                  value={firstBar.chord}
                  onChange={handleFirstBarChordChange}
                  className="text-gray-800 rounded-md border border-gray-500 focus:outline-none"
                >
                  <option value="Maj7">Maj7</option>
                  <option value="7">7</option>
                  <option value="m7">m7</option>
                  <option value="m7b5">m7b5</option>
                </select>
              </div>

              <div>
                <label className="mr-2">2nd Bar Root:</label>
                <select
                  value={secondBar.root}
                  onChange={handleSecondBarRootChange}
                  className="text-gray-800 rounded-md border border-gray-500 focus:outline-none"
                >
                  <option value="C">C</option>
                  <option value="Db">Db/C#</option>
                  <option value="D">D</option>
                  <option value="Eb">Eb/D#</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="Gb">Gb/F#</option>
                  <option value="G">G</option>
                  <option value="Ab">Ab/G#</option>
                  <option value="A">A</option>
                  <option value="Bb">Bb/A#</option>
                  <option value="B">B</option>
                </select>
                <label className="mx-2">Chord:</label>
                <select
                  value={secondBar.chord}
                  onChange={handleSecondBarChordChange}
                  className="text-gray-800 rounded-md border border-gray-500 focus:outline-none"
                >
                  <option value="Maj7">Maj7</option>
                  <option value="7">7</option>
                  <option value="m7">m7</option>
                  <option value="m7b5">m7b5</option>
                </select>
              </div>
            </div>
          </Accordion>
        </div>
      </div>
    </>
  );
}