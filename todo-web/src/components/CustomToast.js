import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomToast = ({setShowToast, heading, body}) => {

  const toggleToast = () => setShowToast(false);

  return (
    <>
      <ToastContainer position="bottom-center">
        <Toast show={true} onClose={toggleToast}>
          <Toast.Header>
            <strong className="mr-auto">{heading}</strong>
          </Toast.Header>
          {body && <Toast.Body>{body}</Toast.Body>}
        </Toast>
      </ToastContainer>
    </>
  );
};

export default CustomToast;
