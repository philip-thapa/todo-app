import React from 'react'

function SucessToast() {
  return (
    <Toast
          className="d-inline-block m-1"
          bg='primary'
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
        </Toast>
  )
}

export default SucessToast