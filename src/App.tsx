import './App.css';
import MajScale from './MajScale';
import ScaleAndChords from './ScaleAndChords';

function App() {
  return (
    <div className="App">
      <div className='p-5 my-5 mx-5 rounded-lg bg-yellow-100 shadow'>
        <MajScale />
        <p>
          Root から指板上に表示するメジャースケールを選択します。
        </p>
        <p>
          Chord から表示されているメジャースケールから指定したダイアトニックコードの構成音に色を付けます。
        </p>
      </div>
      <div className='p-5 my-5 mx-5 rounded-lg bg-green-100 shadow'>
        <ScaleAndChords />
        <p>
          ScaleRoot と Scale Type から指板上に表示するスケールを選択します。
        </p>
        <p>
          1小節目 Root, Chord を選択すると、指板上に表示されているスケール上にコードトーンを赤色で表示します。2小節目も同様に、青色で表示します。重なっている音は紫色で表示します。
        </p>
      </div>
    </div>
  );
}

export default App;
