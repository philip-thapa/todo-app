import { useEffect, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import useAxios from '../useAxios';
import { resetPasswordService } from '../pages/ForgotPassword/ForgotPassword.service';
import CustomSpinner from './Spinner';

const ChangePassword = (props) => {
    const {showModal, closeModal, onModalClose,} = props;

    const [currentPw, setCurrentPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [confirmNewPw, setConfirmNewPw] = useState('')

    const [forgetPwRes, forgetPwError, forgetPwLoading, fetchForgetPw, setForgetPwError] = useAxios();

    useEffect(() => {
        if (!showModal){
            setCurrentPw('')
            setNewPw('')
            setConfirmNewPw('')
        }
    }, [showModal])

    useEffect(() => {
        if (forgetPwRes?.msg === 'success') {
            closeModal();
        }
    }, [forgetPwRes])

    const getPayload = () => {
        return {
            password: currentPw,
            newPassword: newPw,
            confirmPassword: confirmNewPw
        }
    }

    const handleSave = () => {
        if (!currentPw) {
            setForgetPwError('Please enter old password')
            return;
        } 
        if (!newPw.trim()){
            setForgetPwError('Please enter new password')
            return
        }
        if (newPw.trim() < 5){
            setForgetPwError('New password must be aleast 5 char')
            return 
        }
        if (newPw.trim() !== confirmNewPw.trim()){
            setForgetPwError('Password doesnot match')
            return
        }
        fetchForgetPw(resetPasswordService(getPayload()))
        // closeModal();
    }

    return (
        <Modal
            show={showModal} onHide={closeModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Change Password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                        <Form.Label>Retype Password</Form.Label>
                        <Form.Control type="password" value={confirmNewPw} onChange={(e) => setConfirmNewPw(e.target.value)} />
                    </Form.Group>
                </Form>
                {forgetPwError && <Alert variant="warning" onClose={() => setForgetPwError(null)} dismissible>
                    {forgetPwError}
                </Alert>}
            </Modal.Body>
        <Modal.Footer className='justify-content-center'>
        {!forgetPwLoading && <> <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button> </>}
        { forgetPwLoading && <CustomSpinner />}
        </Modal.Footer>
        </Modal>
    );
}

export default ChangePassword
