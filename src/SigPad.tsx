import React from 'react';
import SignaturePad, { Options, PointGroup } from 'signature_pad';
import { dataURL2File, rotateBase64Img } from './utils';
import './SigPad.css';

const classPrefix = 'sigpad-rotate';

type SigPadProps = {
  footer?: React.ReactNode;
  options?: Options;
  canvasProps?: { [key: string]: string | { [key: string]: string } };
  onSubmit?: (file: File) => void;
  onCancel?: () => void;
  onEmpty?: () => void;
};

type SigPadState = {};

class SigPad extends React.PureComponent<SigPadProps, SigPadState> {

  private canvasBoxerRef = React.createRef<HTMLDivElement>();
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private sigPad!: SignaturePad;

  constructor (props: SigPadProps) {
    super(props);

    this.initCanvas = this.initCanvas.bind(this);
  }

  get instance (): SignaturePad {
    return this.sigPad;
  }

  get backgroundColor (): string {
    return this.sigPad.backgroundColor;
  }

  set backgroundColor (color: string) {
    this.sigPad.backgroundColor = color;
  }

  get penColor (): string {
    return this.sigPad.penColor;
  }

  set penColor (color: string) {
    this.sigPad.penColor = color;
  }

  /**
   * 转换为 dataUrl
   * @param {?string} type
   * @param {?number} encoderOptions
   */
  async toDataUrl (type?: string, encoderOptions?: number): Promise<string> {
    return this.submitHandler(type, encoderOptions);
  }

  /**
   * 转换为 image File
   * @param {?string} type 
   * @param {?number} encoderOptions
   */
  async toImgFile (type?: string, encoderOptions?: number): Promise<File> {
    const imgDataUrl = await this.submitHandler(type, encoderOptions);
    const file = dataURL2File(imgDataUrl, 'signature.png');
    // File 格式默认 onSubmit 优先级最高
    if (this.props.onSubmit) {
      this.props.onSubmit(file);
      this.close();
    } else {
      return file;
    }
  }

  // /**
  //  * 根据 dataUrl 绘制签名
  //  */
  // fromDataURL(base64String: string): void {
  //   this.sigPad.fromDataURL(base64String);
  // }

  // todo 旋转支持 Data 格式
  // /**
  //  * 
  //  * @param {{PointGroup[]}} data 
  //  */
  // fromData(data: PointGroup[]): void {
  //   this.sigPad.fromData(data);
  // }

  // /**
  //  * 
  //  * @returns {PointGroup[]}
  //  */
  // toData(): PointGroup[] {
  //   return this.sigPad.toData();
  // }

  /**
   * 面板是否为空
   * @returns {boolean}
   */
  isEmpty (): boolean {
    return this.sigPad.isEmpty();
  }

  /**
   * 打开面板
   */
  on(): void {
    this.sigPad.on();
  }

  /**
   * 关闭面板
   */
  off (): void {
    this.sigPad.off();
  }
  
  /**
   * 清空画板
   */
   clear (): void {
    if (this.sigPad) {
      this.sigPad.clear();
    }
  }

  /**
   * 关闭签名组件
   */
  close (): void {
    this.clear();
    this.off();
    this.props.onCancel?.();
  }

  initCanvas (): void {
    let _canvasBox = this.canvasBoxerRef.current;
    const _canvas = this.canvasRef.current;

    if (!_canvasBox || !_canvas) {
      return;
    }

    _canvas.width = _canvasBox.clientWidth;
    _canvas.height = _canvasBox.clientHeight;

    this.clear();
    this.sigPad = new SignaturePad(_canvas, this.props.options);
  }

  /**
   * 提交之前的预处理
   * @param {function} cb callback
   * @param {?string} type mime
   * @param {?number} encoderOptions 
   */
  async submitHandler (type?: string, encoderOptions?: number): Promise<string> {
    // 签名为空
    if (this.sigPad.isEmpty()) {
      this.props.onEmpty?.();
      return;
    }

    const _windowWidth = window.innerWidth;
    const _windowHeight = window.innerHeight;
    const _signResult = this.sigPad.toDataURL(type, encoderOptions);

    // 竖屏时，需要对图像逆时针旋转90度
    // 将签名水平展示
    if (_windowWidth < _windowHeight) {
      return rotateBase64Img(_signResult, -90);
    } else {
      return _signResult;
    }
  }

  componentDidMount(): void {
    this.initCanvas();
    window.addEventListener('resize', this.initCanvas, false);
  }

  componentWillUnmount(): void {
    this.sigPad?.off();
    window.removeEventListener('resize', this.initCanvas, false);
  }

  defaultFooter () {
    return (
      <>
        <div
          className={`${classPrefix}-btn`}
          onClick={() => {
            this.close();
          }}
        >取消</div>
        <div
          className={`${classPrefix}-btn ${classPrefix}-btn-primary`}
          onClick={() => {
            this.toImgFile();
          }}
        >提交</div>
        </>
    );
  }

  render () {
    const  { footer, canvasProps } = this.props;

    return (
      <div className={`${classPrefix}-container`}>
        <div ref={this.canvasBoxerRef} className={`${classPrefix}-canvas-boxer`} {...canvasProps}>
          <canvas ref={this.canvasRef} />
        </div>
        <div className={`${classPrefix}-cover ${footer ? '': classPrefix + '-cover-default'}`}>
          { footer ? footer : this.defaultFooter() }
        </div>
        
      </div>
    );

  }
}

export default SigPad;
