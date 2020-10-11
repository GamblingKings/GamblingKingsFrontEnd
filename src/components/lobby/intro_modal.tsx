import React from 'react';

type IntroModalProps = {
  closeModal: () => void;
};

const IntroModal = ({ closeModal }: IntroModalProps): JSX.Element => (
  <div className="modal">
    <div className="modal-content background-color-white padding-30 border-radius-20">
      <h1 className="text-align-center margin-bottom-10">Welcome to Gambling Kings - Mahjong!</h1>
      <div className="margin-left-30 margin-bottom-30">
        <h2 className="margin-bottom-10">To start, either:</h2>
        <h3 className="margin-bottom-20 margin-left-20">1) Create a game and wait for others to join you!</h3>
        <h3 className="margin-left-20">2) Join an existing one in the lobby page!</h3>
      </div>
      <div className="margin-left-30 margin-bottom-30">
        <h3 className="margin-bottom-20">Games can only start once you have 4 players in your game lobby.</h3>
        <h3>Have fun!</h3>
      </div>
      <div className="text-align-center">
        <button onClick={closeModal} type="button" className="padding-10 background-color-primary border-radius-10">
          I understand!
        </button>
      </div>
    </div>
  </div>
);

export default IntroModal;
