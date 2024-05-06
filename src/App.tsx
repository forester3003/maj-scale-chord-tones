import './App.css';
import MajScale from './MajScale';

function App() {
  return (
    <div className="App">
      <MajScale />
      <div className='p-5 my-5 mx-5 rounded-lg bg-yellow-100 shadow'>
        <p>
          Root から指板上に表示するメジャースケールを選択します。
        </p>
        <p>
          Chord から表示されているメジャースケールから指定したダイアトニックコードの構成音に色を付けます。
        </p>
      </div>
    </div>
  );
}

export default App;
