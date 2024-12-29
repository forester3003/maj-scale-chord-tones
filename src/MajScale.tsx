import React, { useEffect, useRef, useState } from "react";
import { Fretboard } from "@moonwave99/fretboard.js";

export default function MajScale() {
  // フレットボードの描画用のref
  const fretboardRef = useRef<HTMLElement>(null);
  // 選択されたルート音とコードのstate（ローカルストレージから初期値を読み込む）
  const [root, setRoot] = useState(() => localStorage.getItem("majScaleRoot") || "C");
  const [chord, setChord] = useState(() => localStorage.getItem("majScaleChord") || "I_Maj7");
  // 選択状態の画面表示用のstate
  const [selectedValues, setSelectedValues] = useState({
    root: localStorage.getItem("majScaleRoot") || "C",
    chord: localStorage.getItem("majScaleChord") || "I_Maj7",
  });

  // root または chord が変更されたときにローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("majScaleRoot", root);
  }, [root]);

  useEffect(() => {
    localStorage.setItem("majScaleChord", chord);
  }, [chord]);

  useEffect(() => {
    setSelectedValues({ root: root, chord: chord });
  }, [root, chord]);

  useEffect(() => {
    console.log(root, chord);
    // レンダリング
    if (fretboardRef.current) {
      fretboardRef.current.innerHTML = ""; // すでに要素が存在する場合はクリアする

      // フレットボードの初期化
      const fretboard = new Fretboard({
        el: fretboardRef.current,
        dotSize: 28,
        highlightFill: "whitesmoke",
        width: 960,
      });

      // フレットボードにメジャースケールを描画
      fretboard.renderScale({
        root: root,
        type: "ionian",
      });

      // 音名と度数を表示
      fretboard.style({
        // text: ({ note }: { note: any }) => note,
        text: ({ interval, note }: { interval: any; note: any }) =>
          interval + "/" + note,
        fontSize: 10,
      });

      // Ionianにおけるダイアトニックコード定義
      const chordsDefinition: { [key: string]: string[] } = {
        I_Maj7: ["1P", "3M", "5P", "7M"],
        II_m7: ["2M", "4P", "6M", "1P"],
        III_m7: ["3M", "5P", "7M", "2M"],
        IV_Maj7: ["4P", "6M", "1P", "3M"],
        V_7: ["5P", "7M", "2M", "4P"],
        VI_m7: ["6M", "1P", "3M", "5P"],
        VII_m7b5: ["7M", "2M", "4P", "6M"],
      };

      const chordComponent: string[] = chordsDefinition[chord];

      chordComponent.forEach((interval, index) => {
        // rootの場合は色を変える
        if (index === 0) {
          fretboard.style({
            filter: { interval: interval },
            fill: "orange",
          });
          // それ以外のインターバルリストに入っているものは色を変える
        } else {
          fretboard.style({
            filter: { interval: interval },
            fill: "skyblue",
          });
        }
      });

      /*fretboard.highlightAreas([
        { string: 1, fret: 5 },
        { string: 6, fret: 2 },
      ]);*/
      console.log("rendered");
    }
  }, [root, chord]); // 依存配列が変更されるたびに再レンダリングをトリガー

  // ルート音が変更されたときキックされる関数
  const handleRootChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // rootのstateを更新
    setRoot(event.target.value);
  };

  // コードが変更されたときキックされる関数
  const handleChordChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // chordのstateを更新
    setChord(event.target.value);
  };

  return (
    <>
      <div className="flex justify-center items-center mt-4">
        <label className="mr-2">Root:</label>
        <select
          value={root}
          onChange={handleRootChange}
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
          value={chord}
          onChange={handleChordChange}
          className="text-gray-800 rounded-md border border-gray-500 focus:outline-none"
        >
          <option value="I_Maj7">IMaj7</option>
          <option value="II_m7">IIm7</option>
          <option value="III_m7">IIIm7</option>
          <option value="IV_Maj7">IVMaj7</option>
          <option value="V_7">V7</option>
          <option value="VI_m7">VIm7</option>
          <option value="VII_m7b5">VIIm7b5</option>
        </select>
      </div>
      <div className="text-center mt-4">
        <span>{selectedValues.chord.replace(/_/g, "")} of {selectedValues.root} Major Scale</span>
      </div>
      <div className="overflow-x-auto">
        <figure ref={fretboardRef} className="flex-none"></figure>
      </div>
    </>
  );
}