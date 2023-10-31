import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const PopUpModal = (props) => {
    const {showModal, closeModal, onModalClose, title, desc, selectedTodo} = props;
    const [todo, setTodo] = useState('');

    useEffect(() => {
        setTodo(props?.selectedTodo?.todo_name);
      }, [props.selectedTodo]);

    const actions = {
        'EDIT': 'EDIT',
        'DELETE': 'DELETE'
    } 

    const handleSave = () => {
        const data = {
            action: title,
            todoId: selectedTodo.id
        }
        if(title == actions.EDIT){
            data['newName'] = todo;
        }
        onModalClose(data);
        closeModal();
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
            {title}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            { desc && <p>
                {desc}
            </p>}
            {title == actions.EDIT && <Form.Control
                placeholder="Edit Todo"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={todo}
                onChange={e=> setTodo(e.target.value)} 
            />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {title == actions.EDIT ? 'Save Changes' : 'Delete'}
          </Button>
        </Modal.Footer>
        </Modal>
    );
}

export default PopUpModal
