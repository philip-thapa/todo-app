import React, {useEffect, useState} from 'react';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faStar as solidFaStar } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark, faFile, faSun, faStar as regFaStar } from '@fortawesome/free-regular-svg-icons';
import './RightPanel.css'
import { addMydayService, updateTodoService } from '../pages/Home/Home.service';
import useAxios from '../useAxios';
import CustomSpinner from './Spinner';

function RightPanel({todo, openModal, handleReload, handleCheck}) {
    const actions = {
        'EDIT': 'EDIT',
        'DELETE': 'DELETE'
    }

    const [note, setNote] = useState('');
    const [updateRes, updateError, updateLoad, updateTodo, setUpdateError] = useAxios();
    const [addMyDayRes, addMyDayError, addMydayLoad, fetchAddMyDay, setAddMyDayError] = useAxios();
    const errorState = [updateError, addMyDayError];

    useEffect(() => {
       if (updateRes?.success || addMyDayRes?.msg === 'success'){
        handleReload(true)
       }
    }, [updateRes, addMyDayRes])

    useEffect(() => {
        if(todo?.note){
            setNote(todo?.note)
        } else {
            setNote('')
        }
    }, [todo])

    const handleClick = (type) => {
        openModal(type)
    }

    const getFilters = () => {
        return {
            todoId: todo.id,
            note: note
        }
    }

    const handleBlur = () => {
        updateTodo(updateTodoService(getFilters()))
        setNote('')
    }

    const addToMyDayHandler = (isAdd) => {
        let filter = {
            todoId: todo.id
        }
        if (isAdd){
            filter['isAdd'] = true
        }
        fetchAddMyDay(addMydayService(filter))
    }

    const renderAlerts = errorState.map((error, index) => (
        error && (
          <Row key={index}>
            <Alert variant="warning" onClose={() => setUpdateError(null)} dismissible>
              {error}
            </Alert>
          </Row>
        )
      ))

    return (
        <div>
            {(updateLoad || addMydayLoad) && <Row><CustomSpinner /></Row>}
            {renderAlerts}
            <Row className='bgc'>
                <Col xs={1} style={{marginLeft: '20px'}}>
                    {<Form.Check checked={todo.completed} aria-label="option 1" 
                        onChange={(e) => handleCheck(e, todo.id, todo.completed ? 'NOT_COMPLETED' : 'COMPLETED')} />}
                </Col>
                <Col xs={9}>
                    <p className={`font-weight-bold ${todo.completed ? 'text-decoration-line-through' : ''}`}>{todo.todo_name}</p>
                </Col>
                <Col xs={1}>
                    <FontAwesomeIcon icon={todo?.is_important ? solidFaStar : regFaStar } 
                    onClick={(e) => handleCheck(e, todo.id, todo.is_important ? 'NOT_IMPORTANT' : 'IMPORTANT')} />
                </Col>
            </Row>
            <Row className='bgc'>
                <Col xs={1}>
                    <FontAwesomeIcon icon={faSun} />
                </Col>
                <Col xs={10}>
                    {!todo?.my_day && <p onClick={() => addToMyDayHandler(true)} className={`font-weight-light`}>Add to My Day</p>}
                    {todo?.my_day && <p className='font-weight-light color-green'>Added to My Day</p>}
                </Col>
                <Col xs={1}>
                    { todo?.my_day && <FontAwesomeIcon onClick={() => addToMyDayHandler(false)} title='Remove from My Day' icon={faCircleXmark} /> }
                </Col>
            </Row>
            <Row className='bgc' onClick={() => handleClick(actions.EDIT)}>
                <Col xs={1}>
                    <FontAwesomeIcon icon={faPencil} />
                </Col>
                <Col xs={10}>
                    <p className='font-weight-light'>Edit</p>
                </Col>
                <Col xs={1}>
                </Col>
            </Row>
            <Row className='bgc' onClick={() => handleClick(actions.DELETE)}>
                <Col xs={1}>
                    <FontAwesomeIcon icon={faTrash} />
                </Col>
                <Col xs={10}>
                    <p className='font-weight-light'>Delete</p>
                </Col>
                <Col xs={1}>
                </Col>
            </Row>
            <Row className='bgc'>
                <Col xs={1}>
                    <FontAwesomeIcon icon={faFile} />
                </Col>
                <Col xs={10}>
                    <p className='font-weight-light'>Add file</p>
                </Col>
                <Col xs={1}>
                </Col>
            </Row>
            <Row className='bgc'>
                <Form.Control
                    as="textarea"
                    placeholder="Note"
                    style={{ height: '100px' }}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onBlur={handleBlur}
                />
            </Row>
        </div>
    )
}

export default RightPanel
