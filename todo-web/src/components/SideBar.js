import React, { useState } from 'react';
import { Accordion, Card, Col, Row } from 'react-bootstrap';
import './SideBar.css'
import { faCalendarDays, faStar, faSun } from '@fortawesome/free-regular-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { clearSearch } from '../redux/todoSlice';

function SideBar({sideBarHandle, current}) {
  const filterMapping = [{'My Day': faSun}, {'Important': faStar}, {'Planned': faCalendarDays}, {'Tasks': faHouse}];
  const dispatch = useDispatch();

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Filter By</Accordion.Header>
        <Accordion.Body style={{padding: 0}}>
          {
            filterMapping.map(filter=>(
              <div style={{padding: '15px 15px', cursor: 'pointer', backgroundColor: '#EFF6FC'}} 
                className={current == Object.keys(filter)[0] ? 'active_section' : 'default_section'} 
                key={Object.keys(filter)[0]} 
                onClick={() => {
                  sideBarHandle(Object.keys(filter)[0])
                  dispatch(clearSearch())
                  }}>
                <Row>
                  <Col xs={1}>
                    <FontAwesomeIcon icon={Object.values(filter)[0]} />
                  </Col>
                  <Col>{Object.keys(filter)[0]}</Col>
                </Row>
              </div>
            ))
          }
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default SideBar