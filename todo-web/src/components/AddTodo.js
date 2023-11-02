import React, { useEffect, useRef, useState } from 'react'
import { Alert, Button, Form, InputGroup, Row } from 'react-bootstrap'
import useAxios from '../useAxios';
import { addTodoService } from '../pages/Home/Home.service';
import CustomSpinner from './Spinner';


function AddTodo({checkReload, sideFilter}) {
  const [todo, setTodo] = useState('');
  const [addResponse, addError, addLoading, addFetch, setAddError] = useAxios();

  const addRef = useRef();

  useEffect(() => {
    if (addResponse?.success){
      setTodo('');
      checkReload(true);
      addRef.current.focus()
    }
  }, [addResponse])

  const addTodo = (e) => {
    e.preventDefault();
    const data = {
      todoName: todo,
      todoType: sideFilter
    }
    addFetch(addTodoService(data))
  }
  return (
    <>
    {(addLoading) && <Row><CustomSpinner /></Row>}
    {!addLoading && <Form onSubmit={addTodo} style={{marginTop: '30px'}}>
      <InputGroup className="mb-3">
        <Form.Control
          ref={addRef}
          placeholder="Add a Task"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          value={todo}
          onChange={e=> setTodo(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === 'Enter'){
              addTodo(e)
            }
        }}
          />
      </InputGroup>
      {addError && <Row style={{margin: '10px'}}>
        <Alert variant="warning" onClose={() => setAddError(null)} dismissible>
          {addError}
        </Alert>
      </Row>}
    </Form>}
    </>
  )
}

export default AddTodo