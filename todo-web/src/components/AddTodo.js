import React, { useEffect, useState } from 'react'
import { Alert, Button, Form, InputGroup, Row } from 'react-bootstrap'
import useAxios from '../useAxios';
import { addTodoService } from '../pages/Home/Home.service';
import CustomSpinner from './Spinner';


function AddTodo({checkReload}) {
  const [todo, setTodo] = useState('');
  const [addResponse, addError, addLoading, addFetch, setAddError] = useAxios();

  useEffect(() => {
    if (addResponse?.success){
      setTodo('');
      checkReload(true);
    }
  }, [addResponse])

  const addTodo = (e) => {
    e.preventDefault();
    const data = {
      todoName: todo
    }
    addFetch(addTodoService(data))
  }
  return (
    <>
    {(addLoading) && <Row><CustomSpinner /></Row>}
    {!addLoading && <Form onSubmit={addTodo} style={{marginTop: '30px'}}>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Add a Task"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          value={todo}
          onChange={e=> setTodo(e.target.value)} />
        <Button type='submit' variant="outline-secondary" id="button-addon2" onClick={addTodo}>
          Add
        </Button>
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