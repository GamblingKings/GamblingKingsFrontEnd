/* eslint-disable prettier/prettier */
import React from 'react';

type AboutModalProps = {
  closeModal: () => void;
};

const AboutModal = ({ closeModal }: AboutModalProps): JSX.Element => (
  <div className="modal">
    <div className="modal-content background-color-white padding-30 border-radius-20">
      <h1 className="text-align-center margin-bottom-10">About Us</h1>
      <div className="margin-left-30 margin-bottom-30">
        <h2 className="margin-bottom-20">We are three students from the BCIT CST program.</h2>
        <h3 className="margin-bottom-20">
          <a href="https://www.linkedin.com/in/1patrickjiang/">Patrick Jiang</a>
          - Back-end Developer / CICD Lead
        </h3>
        <h3 className="margin-bottom-20">
          <a href="https://www.linkedin.com/in/derricklee91/">Derrick Lee</a>
          - Front-end Developer / Team Lead
        </h3>
        <h3 className="margin-bottom-20">
          <a href="https://www.linkedin.com/in/vincent-wong-cs/">Vincent Wong</a>
          - Front-end Developer / Game Logic Lead
        </h3>
      </div>
      <div className="text-align-center">
        <button onClick={closeModal} type="button" className="padding-10 background-color-primary border-radius-10">
          Close
        </button>
      </div>
    </div>
  </div>
);

export default AboutModal;
