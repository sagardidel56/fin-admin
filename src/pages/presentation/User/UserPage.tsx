import React, { useContext, useEffect, useState } from 'react'
import PageWrapper from '../../../layout/PageWrapper/PageWrapper'
import { demoPagesMenu } from '../../../menu'
import Page from '../../../layout/Page/Page'
import TablePage from '../../documentation/components/TablePage'
import Card, { CardBody } from '../../../components/bootstrap/Card'
import Icon from '../../../components/icon/Icon'
import Checks from '../../../components/bootstrap/forms/Checks'
import PaginationButtons, { dataPagination } from '../../../components/PaginationButtons'
import useSelectTable from '../../../hooks/useSelectTable'
import useSortableData from '../../../hooks/useSortableData'
import Button from '../../../components/bootstrap/Button'
import { deleteAPIAuth, getAPIAuth, postAPI, postAPIAuth, putAPIAuth } from '../../../service/apiInstance'
import Avatar from '../../../components/Avatar'
import UserImage from '../../../assets/img/wanna/wanna1.png';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal'
import Logo from '../../../components/Logo'
import Input from '../../../components/bootstrap/forms/Input'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import FormGroup from '../../../components/bootstrap/forms/FormGroup'
import { errorToaster, successToaster } from '../../../utils/toaster'
import AuthContext from '../../../contexts/authContext'
import Select from '../../../components/bootstrap/forms/Select'
import Option from '../../../components/bootstrap/Option'
import OffCanvas, { OffCanvasBody, OffCanvasHeader, OffCanvasTitle } from '../../../components/bootstrap/OffCanvas'
import moment from 'moment'

const validate = Yup.object({
    firstName: Yup.string().required("This is a required field"),
    lastName: Yup.string().required('This is a required field'),
    email: Yup.string().email().required('This is a required field'),
    password: Yup.string().required('This is a required field'),
});

const validateEdit = Yup.object({
    firstName: Yup.string().required("This is a required field"),
    lastName: Yup.string().required('This is a required field'),
    email: Yup.string().email().required('This is a required field'),
    password: Yup.string().optional(),
});

type UserDataType = {
    firstName: string;
    lastName: string;
    email: string;
    password: string
}
// type validate = InferType<typeof userSchema>;
const UserPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [data, setData] = useState([])
    const [totalItems, setTotalItems] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("")
    const [selectedUser, setSelectedUser] = useState({})
    const [editPanel, setEditPanel] = useState(false)
    console.log({ selectedUser })
    const { items, requestSort, getClassNamesFor } = useSortableData(data);
    // const onCurrentPageData = dataPagination(items, currentPage, perPage);
    const { selectTable, SelectAllCheck } = useSelectTable(items);
    const [isEditing, setIsEditing] = useState(false)
    const { token } = useContext(AuthContext)
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
        validationSchema: isEditing ? validateEdit : validate,
        onSubmit: (values) => {
            if (isEditing) {
                console.log('runinng')
                editHandler(values)
            } else {
                addUser(values)

            }
        }
    })
    const getData = async (id: string = "") => {
        console.log({ status })
        try {
            let payload = {}
            if (!!id) {
                payload = {
                    id: selectedUser?._id
                }
            } else {
                payload = {
                    skip: (currentPage - 1) * perPage,
                    limit: perPage,
                    status: {}
                }
            }
            if (!!search && !id) {
                payload.search = search
            }
            if (!!status && !id) {
                payload.status[status] = true
            }
            console.log("sssssss", { payload })
            const res = await postAPIAuth('user/getUserList', payload)
            setTotalItems(res.data?.countDocument)
            if (res?.data?.success) {
                if (id) {
                    setSelectedUser(res?.data?.data?.[0])
                } else {
                    setData(res?.data?.data)
                }
            }

        } catch (error) {
            console.log('error', error)
        }
    }
    const addUser = async (values: UserDataType) => {
        console.log("addUser")
        try {
            const payload = {
                "firstName": values.firstName,
                "lastName": values.lastName,
                "email": values.email,
                "password": values.password
            }
            const res = await postAPI('user/createAccount', payload, true)
            if (res.data.success) {
                console.log('userresres', { res })
                successToaster("User created successfully!")
                formik.resetForm()
                setIsOpen(false)
                getData()
            } else {
                errorToaster(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const editHandler = async (values: UserDataType) => {
        console.log("addUser")
        try {
            const payload: any = {
                "userId": selectedUser?._id,
                "firstName": values.firstName,
                "lastName": values.lastName,
                "email": values.email,
            }
            if (values.password) {
                payload.password = values.password
            }
            const res = await putAPIAuth('user/editUserProfile', payload)
            if (res.data.success) {
                console.log('userresres', { res })
                successToaster("User updated successfully!")
                formik.resetForm()
                setIsOpen(false)
                getData()
            } else {
                errorToaster(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const deleteUser = async (id) => {
        try {
            const payload = {
                userId: id
            }
            const res = await deleteAPIAuth('user/deleteUser', payload)
            if (res.data.success) {
                console.log('userresres', { res })
                successToaster("User deleted successfully!")
                formik.resetForm()
                setIsOpen(false)
                getData()
            } else {
                errorToaster(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (token) {
            getData()
        }
    }, [currentPage, perPage, token])
    // useEffect(() => {
    //     if (selectedUser?._id) {
    //         getData(selectedUser?._id)
    //     }
    // }, [selectedUser?._id])
    // console.log({selectedUser})
    return (
        <PageWrapper title={"users"}>
            <Page container='fluid'>
                <div>Users</div>
                <Card>
                    <CardBody>
                        <div className='flex-grow-1 row'>
                            <div className='col-2'>
                                <Button
                                    onClick={() => {
                                        setIsOpen(true)
                                    }}
                                    color='primary'
                                    icon='Add'
                                >
                                    Add User
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className='flex-grow-1 row'>
                            <div className='col-4 d-flex align-items-center'>
                                <div className=''>
                                    <FormGroup
                                        id='Search'
                                        isFloating
                                        label='Email or Name'
                                    >
                                        <Input
                                            type='text'
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <div className='col-4 d-flex align-items-center'>
                                <Select
                                    size='sm'
                                    ariaLabel='Per'
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <Option value={""}>Select status</Option>
                                    <Option value={"loginStatus"}>Logged In</Option>
                                    <Option value={'isBlocked'}>Blocked</Option>
                                    <Option value={"isActive"}>Active</Option>
                                    <Option value={'isDelete'}>Delete</Option>

                                </Select>
                            </div>
                            <div className='col-2 d-flex align-items-center'>
                                <Button
                                    onClick={() => {
                                        // setIsOpen(true)
                                        getData()
                                    }}
                                    color='primary'
                                // icon='Filter'
                                >
                                    Filter
                                </Button>
                            </div>

                        </div>
                    </CardBody>
                </Card>
                <div className='col-12'>
                    <Card>
                        <CardBody>
                            <table className='table table-modern'>
                                <thead>
                                    <tr>
                                        {/* <th style={{ width: 50 }}>
                                            {SelectAllCheck}
                                        </th> */}
                                        <th
                                            // onClick={() => requestSort('firstName')}
                                            className='cursor-pointer text-decoration-underline'>
                                            Profile{' '}
                                            {/* <Icon
                                                size='lg'
                                                className={getClassNamesFor('firstName')}
                                                icon='FilterList'
                                            /> */}
                                        </th>
                                        <th
                                            onClick={() => requestSort('firstName')}
                                            className='cursor-pointer text-decoration-underline'>
                                            First Name{' '}
                                            <Icon
                                                size='lg'
                                                className={getClassNamesFor('firstName')}
                                                icon='FilterList'
                                            />
                                        </th>
                                        <th
                                            onClick={() => requestSort('lastName')}
                                            className='cursor-pointer text-decoration-underline'>
                                            Last Name{' '}
                                            <Icon
                                                size='lg'
                                                className={getClassNamesFor('lastName')}
                                                icon='FilterList'
                                            />
                                        </th>
                                        <th
                                            onClick={() => requestSort('email')}
                                            className='cursor-pointer text-decoration-underline'>
                                            Email{' '}
                                            <Icon
                                                size='lg'
                                                className={getClassNamesFor('email')}
                                                icon='FilterList'
                                            />
                                        </th>
                                        <th
                                            // onClick={() => requestSort('lastName')}
                                            className='cursor-pointer text-decoration-underline'>
                                            Actions{' '}
                                            {/* <Icon
                                                size='lg'
                                                // className={getClassNamesFor('lastName')}
                                                icon='FilterList'
                                            /> */}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item._id}>
                                            {/* <td aria-label='Check'>
                                                <Checks
                                                    id={item?._id?.toString()}
                                                    name='selectedList'
                                                    value={item.id}
                                                    onChange={selectTable.handleChange}
                                                    checked={selectTable.values.selectedList.includes(
                                                        // @ts-ignore
                                                        item?._id?.toString(),
                                                    )}
                                                />
                                            </td> */}
                                            <td>
                                                <Avatar
                                                    // srcSet={UserImageWebp}
                                                    src={item?.profile_image ? item?.profile_image : UserImage}
                                                    // src={'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg'}
                                                    size={32}
                                                    border={2}
                                                    userName={`${item.firstName} ${item.lastName}`}
                                                />
                                            </td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.email}</td>
                                            <td>
                                                <Button
                                                    onClick={() => {
                                                        setIsEditing(true)
                                                        formik.setValues({
                                                            firstName: item.firstName,
                                                            lastName: item.lastName,
                                                            email: item.email,
                                                            password: ""
                                                        })
                                                        setIsOpen(true)
                                                        setSelectedUser(item)
                                                    }}
                                                    icon='ModeEdit'
                                                ></Button>
                                                <Button
                                                    onClick={() => {
                                                        setSelectedUser(item)
                                                        setEditPanel(true)
                                                    }}
                                                    icon='Preview'
                                                ></Button>
                                                <Button
                                                    onClick={() => {
                                                        // deleteCompetition(item?._id)
                                                        setSelectedUser(item)
                                                        setIsDeleteOpen(true)
                                                    }}
                                                    icon='Delete'
                                                ></Button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardBody>
                        <PaginationButtons
                            data={items}
                            label='items'
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            perPage={perPage}
                            setPerPage={setPerPage}
                            totalItems={totalItems}
                        />
                    </Card>
                </div>
                <Modal isOpen={isOpen} setIsOpen={setIsOpen} titleId='tour-title'>
                    <ModalHeader
                        setIsOpen={setIsOpen}
                    >
                        <ModalTitle id='tour-title' className='d-flex align-items-end'>
                            {" "}
                        </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <div className='h3 text-center'>{isEditing ? "Edit User" : "Add User"}</div>
                        <div className='row'>
                            <div className='col-md-6 py-2'>
                                <FormGroup
                                    id='firstName'
                                    isFloating
                                    label='First Name'
                                >
                                    <Input
                                        type='text'
                                        // autoComplete='current-password'
                                        value={formik.values.firstName}
                                        isTouched={formik.touched.firstName}
                                        invalidFeedback={
                                            formik.errors.firstName
                                        }
                                        validFeedback='Looks good!'
                                        isValid={formik.isValid}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </FormGroup>
                            </div>
                            <div className='col-md-6 py-2'>
                                <FormGroup
                                    id='lastName'
                                    isFloating
                                    label='Last Name'
                                >
                                    <Input
                                        type='text'
                                        // autoComplete='current-password'
                                        value={formik.values.lastName}
                                        isTouched={formik.touched.lastName}
                                        invalidFeedback={
                                            formik.errors.lastName
                                        }
                                        validFeedback='Looks good!'
                                        isValid={formik.isValid}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    // onFocus={() => {
                                    //     formik.setErrors({});
                                    // }}
                                    />
                                </FormGroup>
                            </div>
                            <div className='col-md-12 py-2'>
                                <FormGroup
                                    id='email'
                                    isFloating
                                    label='Email'
                                >
                                    <Input
                                        type='email'
                                        value={formik.values.email}
                                        isTouched={formik.touched.email}
                                        invalidFeedback={
                                            formik.errors.email
                                        }
                                        validFeedback='Looks good!'
                                        isValid={formik.isValid}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </FormGroup>
                            </div>
                            <div className='col-md-12 py-2'>
                                <FormGroup
                                    id='password'
                                    isFloating
                                    label='Password'

                                >
                                    <Input
                                        type='password'
                                        value={formik.values.password}
                                        isTouched={formik.touched.password}
                                        invalidFeedback={
                                            formik.errors.password
                                        }
                                        validFeedback='Looks good!'
                                        isValid={formik.isValid}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </FormGroup>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button icon='Close' color='danger' isLink onClick={() => {
                            setIsOpen(false)
                            formik.resetForm()
                        }}>
                            Discard
                        </Button>
                        <Button
                            icon='DoneOutline'
                            color='success'
                            isLight
                            isDisable={!!Object.keys(formik.errors).length}
                            onClick={formik.handleSubmit}
                        >
                            {isEditing ? "Update User" : "Create User"}
                        </Button>
                    </ModalFooter>
                </Modal>
                {/* delete modal */}
                <Modal isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} titleId='tour-title-delete'>
                    <ModalHeader
                        setIsOpen={setIsDeleteOpen}
                    >
                        <ModalTitle id='tour-title-delete' className='d-flex align-items-end'>
                            {" "}
                        </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <div className='h3 text-center'>{"Delete User"}</div>
                        <div className='row pt-3'>
                            <p>Are you sure you want to delete this user ?</p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button icon='Close' color='danger' isLink onClick={() => {
                            setSelectedUser({})
                            setIsDeleteOpen(false)
                        }}>
                            Discard
                        </Button>
                        <Button
                            icon='DoneOutline'
                            color='success'
                            isLight
                            // isDisable={!!Object.keys(formik.errors).length}
                            onClick={() => {
                                deleteUser(selectedUser?._id)
                                setIsDeleteOpen(false)
                            }}
                        >
                            {"Confirm"}
                        </Button>
                    </ModalFooter>
                </Modal>
                <OffCanvas
                    setOpen={setEditPanel}
                    isOpen={editPanel}
                    isRightPanel
                    tag='form'
                    noValidate
                    onSubmit={formik.handleSubmit}
                >
                    <OffCanvasHeader setOpen={setEditPanel}>
                        <OffCanvasTitle id='edit-panel'>
                            {"User Details"}
                        </OffCanvasTitle>
                    </OffCanvasHeader>
                    <OffCanvasBody>
                        <div>
                            <div className='d-flex justify-content-center'>
                                <img src={selectedUser.profile_image}
                                    style={{
                                        width: "200px"
                                    }}
                                    alt="User image" />
                            </div>
                            <div className='row '>
                                <div className='d-flex justify-content-between py-2'>
                                    <p className='h5 fw-bold'>
                                        Name :
                                    </p>
                                    <p
                                        className='h5'
                                    >
                                        {selectedUser?.firstName}{' '}{selectedUser?.lastName}
                                    </p>
                                </div>
                                <div className='d-flex justify-content-between py-2'>
                                    <p className='h5 fw-bold'>
                                        Email :
                                    </p>
                                    <p
                                        className='h5'
                                    >
                                        {selectedUser?.email}{' '}
                                    </p>
                                </div>
                                {/* <div className='d-flex justify-content-center py-2'>
                                    <p className='h5 fw-bold'>
                                        Invest :
                                    </p>
                                    <p className='h5 '>
                                        {selectedUser?.invest}
                                    </p>
                                </div> */}
                            </div>
                        </div>
                    </OffCanvasBody>
                    <div className='p-3'>

                    </div>
                </OffCanvas>
            </Page>
        </PageWrapper>

    )
}

export default UserPage