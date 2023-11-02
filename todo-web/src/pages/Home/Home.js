import React, {useEffect, useState} from 'react'
import Base from '../../components/Base';
import useAxios from '../../useAxios';
import { delTodoService, getAllTodosService, markTodoService, updateTodoService } from './Home.service';
import CustomSpinner from '../../components/Spinner';
import { Accordion, Alert, Col, Form, Row } from 'react-bootstrap';
import AddTodo from '../../components/AddTodo';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidFaStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regFaStar } from '@fortawesome/free-regular-svg-icons';
import { useSelector } from 'react-redux';
import HomeHeader from '../../components/HomeHeader';
import SideBar from '../../components/SideBar';
import PopUpModal from '../../components/PopUpModal';
import { DELETE_MSG } from '../../const/Messages';
import RightPanel from '../../components/RightPanel';
import '../globalpagecss.css'


const Home = () => {
    const actions = {
      'EDIT': 'EDIT',
      'DELETE': 'DELETE'
    } 
    const [todoData, todoError, todoLoading, fetchTodoData, setTodoError] = useAxios();
    const [markRes, markError, markLoad, fetchMark] = useAxios();
    const [updateRes, updateError, updateLoad, updateTodo] = useAxios();
    const [delRes, delError, delLoad, delTodo] = useAxios();
    const {searchText} = useSelector(store => store.todoReducer);
    const [sideFilter, setSideFilter] = useState('My Day');
    const [modalShow, setModalShow] = React.useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDesc, setModalDesc] = useState('');
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [showThirdSidePanel, setShowThirdSidePanel] = useState(false);
    const [reload, setReload] = useState(false);
    const errorState = [todoError, markError, updateError, delError];

    useEffect(() => {
      fetchTodoData(getAllTodosService(getFilters()));
      if (showThirdSidePanel){
        setShowThirdSidePanel(false);
      }
    }, [sideFilter, searchText])
    
    useEffect(() => {
      if (markRes?.msg == 'success' || delRes?.msg == 'success') {
        fetchTodoData(getAllTodosService(getFilters()));
        handleSelectedTodo()
      }
    }, [markRes, delRes])

    useEffect(() => {
      if(reload){
        fetchTodoData(getAllTodosService(getFilters()));
        setReload(false)
      }
    }, [reload])
    

    const handleSelectedTodo = () => {
      if (todoData?.not_completed && selectedTodo) {
        for (let todo of todoData.not_completed) {
          if (todo.id === selectedTodo.id){
            setSelectedTodo(todo)
            return
          }
        }
      }

      if(todoData.completed && selectedTodo) {
        for (let todo of todoData.completed) {
          if (todo.id === selectedTodo.id){
            setSelectedTodo(todo)
            return
          }
        }
      }
      setSelectedTodo(null);
      setShowThirdSidePanel(false);
    }

    useEffect(() => {
      if (todoData?.not_completed && selectedTodo){
        handleSelectedTodo();
      }
    }, [todoData])

    const getFilters = () => {
      return {
        search: searchText ? searchText : '',
        dayFilter: sideFilter ? sideFilter: 'My Day'
      }
    }

    const handleSideChange = (value) => {
        setSideFilter(value)
    }
  

    const handleReload = (flag) => {
      if(flag){
        fetchTodoData(getAllTodosService(getFilters()));
        setReload(true)
      }
    }

    const handleCheck = (e, id, type) => {
      e.stopPropagation(); 
      let filter = {
        id,
        type,
      }
      fetchMark(markTodoService(filter))
    }

    const openModal = (type) => {
      setModalTitle(type)
      if (type == actions.DELETE){
        setModalDesc(DELETE_MSG)
      }
      setModalShow(true)
    } ;

    const setDefaultState = () => {
      setModalShow(false)
      setModalTitle('');
      setModalDesc('');
      setReload(true);
    }

    const closeModal = () => {
      setModalShow(false);
    };

    const handleModalClose = (data) => {
      if(data.action == actions.EDIT){
        updateTodo(updateTodoService({
          todoId: data.todoId,
          todoName: data.newName
        }))
      } else {
        delTodo(delTodoService({
          todoId: data.todoId
        }))
      }
      setDefaultState();
    }

    const showTodoDetails = (todo) => {
      setSelectedTodo(() => todo)
      setShowThirdSidePanel(true)
    }

  const renderAlerts = errorState.map((error, index) => (
    error && (
      <Row key={index}>
        <Alert variant="warning" onClose={() => setTodoError(null)} dismissible>
          {error}
        </Alert>
      </Row>
    )
  ))

  return (
    <Base>
      <Row style={{marginTop: '10px', backgroundColor: '#FAF9F8'}}>
        <Col xs={2} style={{backgroundColor: '#fff'}}>
          <SideBar sideBarHandle={handleSideChange} current={sideFilter} />
        </Col>
        <Col className={`bg-FAF9F8 ${!showThirdSidePanel ? 'mr-40' : ''}`} style={{height: '90vh', overflowY: 'auto'}}>
          <HomeHeader sideFilter={sideFilter} />
          <AddTodo checkReload={handleReload} sideFilter={sideFilter} />
          {
            renderAlerts
          }
          {(todoLoading || markLoad || updateLoad || delLoad) && <Row><CustomSpinner /></Row>}
          {
              todoData && todoData?.not_completed && todoData.not_completed.map((todo)=>(
                  <Card key={todo.id} className='mb-1 hover-pointer' >
                      <Card.Body className={`${todo?.my_day ? 'p-b-0' : '', selectedTodo && todo?.id === selectedTodo?.id ? 'active-row': ''}`} >
                        <Row>
                          <Col xs='auto'>
                            <Form.Check style={{display: 'inline', marginLeft: '5px', marginLeft: '10px'}} aria-label="option 1" 
                              onChange={(e) => handleCheck(e, todo.id, 'COMPLETED')} />
                          </Col>
                          <Col xs='10' style={{paddingLeft: '0'}} onClick={() => showTodoDetails(todo)}>
                            <div>{todo.todo_name}</div>
                          </Col>
                          <Col xs='1'>
                              <FontAwesomeIcon title={todo?.is_important ? 'Mark Important' : 'Mark not Important'} 
                                  icon={todo?.is_important ? solidFaStar : regFaStar } 
                                  onClick={(e) => handleCheck(e, todo.id, todo.is_important ? 'NOT_IMPORTANT' : 'IMPORTANT')} />
                          </Col>
                        </Row>
                        { todo?.my_day && <Row>
                          <p className="fw-lighter" style={{fontSize: '14px', padding: '0', margin: '0'}}>My day</p>
                        </Row>}
                      </Card.Body>
                  </Card>
              ))
          }
          <Accordion defaultActiveKey="0" style={{marginTop: '20px'}}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Completed {(todoData && todoData?.completed?.length) || 0}</Accordion.Header>
              <Accordion.Body style={{padding: '0'}}>
              {
                todoData && todoData?.completed && todoData.completed.map(todo=>(
                  <Card key={todo.id} className='mb-1 hover-pointer'>
                      <Card.Body className={`${selectedTodo && todo?.id === selectedTodo?.id ? 'active-row': ''}`}>
                        <Row>
                          <Col xs='auto'>
                            <Form.Check checked style={{display: 'inline', marginRight: '5px', marginLeft: '10px'}} aria-label="option 1" 
                              onChange={(e) => handleCheck(e, todo.id, 'NOT_COMPLETED')} />
                          </Col>
                          <Col xs='10' style={{paddingLeft: '0'}} onClick={() => showTodoDetails(todo)}>
                            <div><p className='text-decoration-line-through m-0'>{todo.todo_name}</p></div>
                          </Col>
                          <Col xs='1'>
                              <FontAwesomeIcon title={todo?.is_important ? 'Mark Important' : 'Mark not Important'} 
                                  icon={todo?.is_important ? solidFaStar : regFaStar } 
                                  onClick={(e) => handleCheck(e, todo.id, todo.is_important ? 'NOT_IMPORTANT' : 'IMPORTANT')} />
                          </Col>
                        </Row>
                        { todo?.my_day && <Row>
                          <p className="fw-lighter" style={{fontSize: '14px', padding: '0', margin: '0'}}>My day</p>
                        </Row>}
                      </Card.Body>
                  </Card>
              ))
          }
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <PopUpModal
            selectedTodo={selectedTodo}
            title={modalTitle}
            desc={modalDesc}
            showModal={modalShow}
            closeModal={closeModal}
            onModalClose={handleModalClose}
          />
        </Col>
        {showThirdSidePanel && 
        <Col xs={3}>
          <RightPanel 
            todo={selectedTodo} 
            openModal={openModal} 
            handleReload={handleReload}
            handleCheck={handleCheck}
          />
        </Col>}
      </Row>        
    </Base>
  )
}

export default Home
