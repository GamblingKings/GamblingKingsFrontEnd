import React from 'react';

type HowToPlayModalProps = {
  closeModal: () => void;
};

const HowToPlayModal = ({ closeModal }: HowToPlayModalProps): JSX.Element => (
  <div className="modal">
    <div className="modal-content background-color-white padding-30 border-radius-20 text-align-center">
      <h1 className="text-align-center margin-bottom-10">Learn to Play</h1>
      <iframe
        style={{ width: '100%', maxWidth: '50vw', height: '40vh' }}
        className="margin-bottom-20"
        src="https://www.youtube.com/embed/qpYF-xmNMew"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Learn Mahjong"
      />
      <div className="text-align-center">
        <button onClick={closeModal} type="button" className="padding-10 background-color-primary border-radius-10">
          Close
        </button>
      </div>
    </div>
  </div>
);

export default HowToPlayModal;
