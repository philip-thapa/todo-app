import React, { useEffect, useState } from 'react'
import Base from '../../components/Base'
import { Card, Col, Container, Row } from 'react-bootstrap'
import './MyProfile.css'
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAxios from '../../useAxios';
import { getMyProfileService } from './MyProfile.service';
import { useSelector } from 'react-redux';
import ChangePassword from '../../components/ChangePassword';
import EditProfile from '../../components/EditProfile';

const MyProfile = () => {
    
    const [modalShow, setModalShow] = useState(false);
    const [editPflModShow, setEditPflModShow] = useState(false);
    const [profileData, profileError, profileLoading, fetchProfileData, setProfileError] = useAxios();
    const {userDetails} = useSelector(store => store.authReducer);

    const callProfileService = () => {
        fetchProfileData(getMyProfileService())
    }

    useEffect(() => {
        if (userDetails) {
            callProfileService()
        }
    }, [])

    const closeModal = () => {
        setModalShow(false);
    }

    return (
        <Base>
            <Container className='mt-50 mb-50'>
                <Row>
                    <Col className='text-left fw-bold'><h3>Your Info</h3></Col>
                    <Col className='text-right' xs={3}>
                        <Row>
                            <Col className='p-0'>
                                <FontAwesomeIcon icon={faKey} />
                            </Col>
                            <Col className='text-left'>
                                <h6 onClick={() => setModalShow(true)} className='text-primary c-p'>Change Password</h6>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Card style={{paddingTop: '5px', paddingBottom: '5px', marginTop: '40px'}}>
                    <Row className='align-items-center'>
                        <Col xs={2}>
                        <Avatar size={150} icon={<UserOutlined />} />
                        </Col>
                        <Col className='text-left p-l-0'>
                            <p>Personalize your account with a photo</p>
                        </Col>
                    </Row>
                </Card>
                <Card className='mt-30'>
                    <Card.Header className='p-t-b-12'>
                        <Row>
                            <Col className='text-left fw-bold'><p>Profile Info</p></Col>
                            <Col className='text-right text-primary fw-bold c-p'><p onClick={() => setEditPflModShow(true)}>Edit Profile Info</p></Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col>Full Name</Col>
                            <Col className='fw-bold'>{profileData?.user?.full_name}</Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>Phone</Col>
                            <Col className='fw-bold'>{profileData?.user?.phone || 'N/A'}</Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>Gender</Col>
                            <Col className='fw-bold'>{profileData?.user?.gender || 'N/A'}</Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className='mt-30'>
                    <Card.Header>
                        <Row>
                            <Col className='text-left fw-bold'>Account Info</Col>
                            {/* <Col className='text-right text-primary fw-bold c-p'>Edit Profile Info</Col> */}
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col>Email</Col>
                            <Col className='fw-bold'>{profileData?.user?.email}</Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>Joined on</Col>
                            <Col className='fw-bold'>{profileData?.user?.created_at}</Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col>Roles</Col>
                            <Col className='fw-bold'>{profileData?.user?.roles}</Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
            <ChangePassword 
            showModal={modalShow}
            closeModal={closeModal}
            />

            <EditProfile 
                showProfileModal={editPflModShow}
                closeProfileModal={(data) => {
                    if (data){
                        callProfileService()
                    }
                    setEditPflModShow(false)
                }}
                details={profileData?.user}
            />
        </Base>
    )
}

export default MyProfile