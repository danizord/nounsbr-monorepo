import { Button } from 'react-bootstrap';
import classes from './NounBRModal.module.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import NounBR from '../../../components/NounBR';
import { svg2png } from '../../../utils/svg2png';
import { Backdrop } from '../../../components/Modal';

const downloadNounBRPNG = (png: string) => {
  const downloadEl = document.createElement('a');
  downloadEl.href = png;
  downloadEl.download = 'nounbr.png';
  downloadEl.click();
};

const NounBRModal: React.FC<{ onDismiss: () => void; svg: string }> = props => {
  const { onDismiss, svg } = props;

  const [width, setWidth] = useState<number>(window.innerWidth);
  const [png, setPng] = useState<string | null>();

  const isMobile: boolean = width <= 991;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    const loadPng = async () => {
      setPng(await svg2png(svg, 512, 512));
    };
    loadPng();

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, [svg]);

  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop
          onDismiss={() => {
            onDismiss();
          }}
        />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <div className={classes.modal}>
          {png && (
            <NounBR
              imgPath={png}
              alt="nounbr"
              className={classes.nounbrImg}
              wrapperClassName={classes.nounbrWrapper}
            />
          )}
          <div className={classes.displayNounBRFooter}>
            <span>Use this NounBR as your profile picture!</span>
            {!isMobile && png && (
              <Button
                onClick={() => {
                  downloadNounBRPNG(png);
                }}
              >
                Download
              </Button>
            )}
          </div>
        </div>,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};
export default NounBRModal;
