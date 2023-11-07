import { useEffect, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import useAxios from '../useAxios';
import CustomSpinner from './Spinner';
import { editMyProfileService } from '../pages/MyProfile/MyProfile.service';

const EditProfile = (props) => {
    const {showProfileModal, closeProfileModal, details} = props;

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [gender, setGender] = useState('')
    const [phone, setPhone] = useState('')

    const genderTypes = ['Male', 'Female', 'N/A']

    const [editProfileRes, editProfileError, editProfileLoading, fetchEditProfile, setEditProfileError] = useAxios();

    useEffect(() => {
        if (details && showProfileModal){
            setFirstName(details?.firstname)
            setLastName(details?.lastname)
            setGender(details?.gender || '')
            setPhone(details?.phone)
        }
    }, [details, showProfileModal])

    useEffect(() => {
        if (editProfileRes?.msg === 'success') {
            closeProfileModal(true);
        }
    }, [editProfileRes])

    const getPayload = () => {
        return {
            firstName,
            lastName,
            gender,
            phone
        }
    }

    const handleSave = () => {
        fetchEditProfile(editMyProfileService(getPayload()))
    }

    return (
        <Modal
            show={showProfileModal} onHide={closeProfileModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit Profile Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSave}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-select" aria-label="Default select example">
                        <option value=''>Select Gender</option>
                        {genderTypes.map(gender=>(
                            <option key={gender} value={gender}>{gender}</option>
                        ))}
                    </select>
                    </Form.Group>
                </Form>
                {editProfileError && <Alert variant="warning" onClose={() => setEditProfileError(null)} dismissible>
                    {editProfileError}
                </Alert>}
            </Modal.Body>
        <Modal.Footer className='justify-content-center'>
        {!editProfileLoading && <> <Button variant="secondary" onClick={closeProfileModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button> </>}
        { editProfileLoading && <CustomSpinner />}
        </Modal.Footer>
        </Modal>
    );
}

export default EditProfile
