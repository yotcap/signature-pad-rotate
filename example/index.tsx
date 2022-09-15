import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import SigPadRotate from '../src/SigPad';
// * 可自定义画板样式
// import './index.css';

const App: React.FC = () => {
  const [imgUrl, setImgUrl] = useState<string>();
  const [sigPadVisible, setSigPadVisible] = useState<boolean>(false);

  const sigPadRef = React.createRef<SigPadRotate>();
  
  return (
    <div>
      <button
        style={{
          display: 'block',
        }}
        onClick={e => {
          e.preventDefault();
          setSigPadVisible(true);
        }}
      >签名</button>
      {
        sigPadVisible ?
          <SigPadRotate
            ref={sigPadRef}

            // footer={
            //   <div>
            //     <button onClick={() => {
            //       const sigpad = sigPadRef.current;
            //       sigpad?.clear();
            //     }}>清除</button>
            //     <button onClick={() => {
            //       const sigpad = sigPadRef.current;
            //       sigpad?.toDataUrl().then(imgDataUrl => {
            //         setImgUrl(imgDataUrl);
            //         sigpad?.close();
            //       });
            //     }}>提交</button>
            //   </div>
            // }

            // canvasProps={{
            //   style: {
            //     // border: '2px solid #000',
            //     backgroundColor: 'orange',
            //   },
            // }}

            onSubmit={file => {
              // TODO sth...
              // 生成的文件
              // 类型为 image/png

              const reader = new FileReader();
              reader.onload = function () {
                setImgUrl(reader.result?.toString());
              };
              reader.readAsDataURL(file);
            }}
            onCancel={() => setSigPadVisible(false)}
          /> : null
      }

      <div style={{ textAlign: 'center', }}>
        { imgUrl ? <img style={{ width: '100%', maxWidth: '300px', }} src={imgUrl} /> : null }
      </div>
    </div>
  );
}

createRoot(document.querySelector('#app')!).render(<App />);
