import React, { useState, useEffect } from 'react';
import './App.css';
import MajScale from './MajScale';
import ScaleAndChords from './ScaleAndChords';
import Accordion from './components/Accordion';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<string>(
    localStorage.getItem('selectedView') || 'majScale' // ローカルストレージから初期値を読み込む
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedView', selectedView); // selectedView が変更されるたびにローカルストレージに保存
  }, [selectedView]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (viewName: string) => {
    setSelectedView(viewName);
    setIsMenuOpen(false);
  };

  const getMenuTitle = () => {
    switch (selectedView) {
      case 'majScale':
        return 'Major Scale & Diatonic Chord Tones';
      case 'scaleAndChords':
        return 'Scale & Two Chords';
      default:
        return '';
    }
  };

  const getMenuExplanation = () => {
    switch (selectedView) {
      case 'majScale':
        return (
          <div className='text-left'>
            <p className='p-1'>
              Root から指板上に表示するメジャースケールを選択します。
            </p>
            <p className='p-1'>
              Chord から表示されているメジャースケールから指定したダイアトニックコードの構成音に色を付けます。
            </p>
            <p className='p-1'>
              Selects a major scale to be displayed on the fretboard from Root.
            </p>
            <p className='p-1'>
              Colors the component notes of the specified diatonic chord from the major scale displayed from Chord.
            </p>
          </div>
        );
      case 'scaleAndChords':
        return (
          <div className='text-left'>
            <p className='p-1'>
              ScaleRoot と Scale Type から指板上に表示するスケールを選択します。
            </p>
            <p className='p-1'>
              1つ目の設定で Root, Chord を選択すると、指板上に表示されているスケール上にそのコードトーンを赤色で表示します。2つ目も同様に設定でき、青色で表示されます。どちらの構成音にもなっている音は紫色で表示します。
            </p>
            <p className='p-1'>
              Select the scale to be displayed on the fingerboard from ScaleRoot and Scale Type.
            </p>
            <p className='p-1'>
              If Root, Chord is selected for the first setting, that chord tone will be displayed in red on the scale shown on the fretboard; the second can be set in the same way and will be displayed in blue. The second can be set in the same way, and will be displayed in blue, while notes that are also in either configuration will be displayed in purple.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const menuTitle = getMenuTitle();
  const menuExplanation = getMenuExplanation();

  return (
    <div className="App">
      {/* ハンバーガーメニューボタン */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-30 bg-gray-200 p-2 rounded-md shadow"
      >
        ☰
      </button>

      {/* ハンバーガーメニュー */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-100 p-4 shadow-md transform transition-transform duration-300 z-40 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isMobile ? 'w-full' : ''}`}
      >
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        <ul>
          <li className="py-2">
            <button
              onClick={() => handleMenuItemClick('majScale')}
              className="block w-full text-left"
            >
              Major Scale & Diatonic Chord Tones
            </button>
          </li>
          <li className="py-2">
            <button
              onClick={() => handleMenuItemClick('scaleAndChords')}
              className="block w-full text-left"
            >
              Scale & Two Chords
            </button>
          </li>
        </ul>
      </div>

      {/* 選択されたメニュー名とアコーディオン */}
      {menuTitle && (
        <div className={`${isMobile ? 'mt-16 px-4 w-full' : 'container mx-auto mt-4'} transition-transform duration-300`}>
          <Accordion title={menuTitle}>
            {menuExplanation}
          </Accordion>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className={`${isMobile ? 'px-4 w-full' : 'container mx-auto'} transition-transform duration-300`}>
        {selectedView === 'majScale' && (
          <div className='p-5 my-5 rounded-lg bg-yellow-50 shadow'>
            <MajScale />
          </div>
        )}

        {selectedView === 'scaleAndChords' && (
          <div className='p-5 my-5 rounded-lg bg-yellow-50 shadow'>
            <ScaleAndChords />
          </div>
        )}
      </div>

      {/* メニューが開いている時に背景を暗くするオーバーレイ (モバイルのみ) */}
      {isMenuOpen && isMobile && (
        <div
          onClick={toggleMenu}
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-30"
        ></div>
      )}
    </div>
  );
}

export default App;