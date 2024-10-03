import React, { useContext, useEffect, useState } from 'react'
import PageWrapper from '../../../layout/PageWrapper/PageWrapper'
import Page from '../../../layout/Page/Page'
import Card, { CardBody } from '../../../components/bootstrap/Card'
import Button from '../../../components/bootstrap/Button'
import Icon from '../../../components/icon/Icon'
import Avatar from '../../../components/Avatar'
import PaginationButtons from '../../../components/PaginationButtons'
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal'
import FormGroup from '../../../components/bootstrap/forms/FormGroup'
import Input from '../../../components/bootstrap/forms/Input'
import { deleteAPIAuth, postAPI, postAPIAuth, postAPIAuthFormData, putAPIAuthFormData } from '../../../service/apiInstance'
import AuthContext from '../../../contexts/authContext'
import useSortableData from '../../../hooks/useSortableData'
import useSelectTable from '../../../hooks/useSelectTable'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { errorToaster, successToaster } from '../../../utils/toaster'
import UserImage from '../../../assets/img/wanna/wanna1.png';
import moment from 'moment'
import OffCanvas, { OffCanvasBody, OffCanvasHeader, OffCanvasTitle } from '../../../components/bootstrap/OffCanvas'

const validate = Yup.object({
  name: Yup.string().required("This is a required field"),
  invest: Yup.number().required('This is a required field'),
  startDate: Yup.string().required('This is a required field'),
});

const validateEdit = Yup.object({
  name: Yup.string().required("This is a required field"),
  invest: Yup.number().required('This is a required field'),
  startDate: Yup.string().required('This is a required field'),
});

type CompetitionDataType = {
  name: string;
  invest: string;
  startDate: string;
  // password: string
}
const CompetitionPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [data, setData] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<any>({})
  const [competition, setCompetition] = useState("")
  const [competitionData, setCompetitionData] = useState({})
  const { token } = useContext(AuthContext)
  const [editPanel, setEditPanel] = useState(false)
  const { items, requestSort, getClassNamesFor } = useSortableData(data);
  // const onCurrentPageData = dataPagination(items, currentPage, perPage);
  const { selectTable, SelectAllCheck } = useSelectTable(items);
  const [isEditing, setIsEditing] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [search, setSearch] = useState("")
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  const getData = async () => {
    try {
      const payload = {
        skip: (currentPage - 1) * perPage,
        limit: perPage
      }
      if (!!search) {
        payload.search = search
      }
      const res = await postAPIAuth('competitions/getCompetitions', payload)
      console.log("sssssss", { res })
      setTotalItems(res.data?.countDocument)
      if (res?.data?.success) {
        setData(res?.data?.data)
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    if (token) {
      getData()
    }
  }, [currentPage, perPage, token])


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      invest: "",
      startDate: "",
      image: ""
    },
    validationSchema: isEditing ? validateEdit : validate,
    onSubmit: (values) => {
      console.log("valuesvalues", { values })
      if (isEditing) {
        updateCompetition(values)
      } else {
        addCompetition(values)

      }
    }
  })

  const addCompetition = async (values: CompetitionDataType) => {
    console.log("addCompetition")
    try {

      const payload: any = new FormData()
      payload.append("typeName", 'competitions')
      payload.append('name', values.name)
      payload.append('invest', values.invest)
      payload.append('startDate', values.startDate)
      payload.append('image', file)
      console.log({ payload })
      const res = await postAPIAuthFormData('competitions/createCompetitions', payload)
      if (res.data.success) {
        console.log('userresres', { res })
        successToaster("Competition created successfully!")
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
  const updateCompetition = async (values: CompetitionDataType) => {
    try {
      const payload: any = new FormData()
      payload.append("typeName", 'competitions')
      payload.append('name', values.name)
      payload.append('invest', values.invest)
      payload.append('startDate', values.startDate)
      payload.append('id', competition)

      if (file.name) {
        payload.append('image', file)
      }
      const res = await putAPIAuthFormData('competitions/updateCompetitions', payload)
      if (res.data.success) {
        console.log('userresres', { res })
        successToaster("Competition created successfully!")
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
  const deleteCompetition = async (id) => {
    try {
      const payload = {
        id: id
      }
      const res = await deleteAPIAuth('competitions/deleteCompetitions', payload)
      if (res.data.success) {
        console.log('userresres', { res })
        successToaster("Competition created successfully!")
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
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };
  const setDateHandler = (date) => {
    // const now = new Date(date);
    // const formattedDate = now.toLocaleString().slice(0, 16);
    // console.log({date,formattedDate})
    // return formattedDate
    const now = new Date(date);

    // Format it to 'YYYY-MM-DDTHH:MM' for datetime-local input
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    console.log({ date, formattedDate });

    return formattedDate;


  }
  useEffect(() => {
    if (!isOpen) {
      formik.resetForm()
      setImageUrl("")
      setFile('')
      setIsEditing(false)
      setCompetition("")
      setCompetitionData({})
    }
  }, [isOpen])

  const getSingleCompetition = async () => {
    try {
      const payload = {
        id: competition
      }
      const res = await postAPIAuth('competitions/getCompetitions', payload)
      setTotalItems(res.data?.countDocument)
      if (res?.data?.success) {
        setCompetitionData(res?.data?.data?.[0])
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    if (competition) {
      getSingleCompetition()
    }
  }, [competition])
  return (
    <PageWrapper title={"competition"}>
      <Page container='fluid'>
        <div>Competitions</div>
        <Card>
          <CardBody>
            <div className='flex-grow-1'>
              <Button
                onClick={() => {
                  setIsOpen(true)
                }}
                color='primary'
                icon='Add'
              >
                Add Competition
              </Button>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className='flex-grow-1 row'>
              <div className='col-4'>
                <div className=''>
                  <FormGroup
                    id='Search'
                    isFloating
                    label='Name'
                  >
                    <Input
                      type='text'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </FormGroup>
                </div>
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
                    <th
                      className='cursor-pointer text-decoration-underline'>
                      Profile{' '}
                    </th>
                    <th
                      onClick={() => requestSort('name')}
                      className='cursor-pointer text-decoration-underline'>
                      Name{' '}
                      <Icon
                        size='lg'
                        className={getClassNamesFor('name')}
                        icon='FilterList'
                      />
                    </th>
                    <th
                      onClick={() => requestSort('invest')}
                      className='cursor-pointer text-decoration-underline'>
                      Invest{' '}
                      <Icon
                        size='lg'
                        className={getClassNamesFor('invest')}
                        icon='FilterList'
                      />
                    </th>

                    <th
                      className='cursor-pointer text-decoration-underline'>
                      Start Time{' '}
                    </th>
                    <th
                      className='cursor-pointer text-decoration-underline'>
                      Actions{' '}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <Avatar
                          src={item?.image ? item?.image : UserImage}
                          size={32}
                          border={2}
                          userName={`${item.name}`}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.invest}</td>
                      <td>{moment(item.startDate).format('YYYY-MM-DD HH:mm')}</td>
                      {/* <td>{moment(item.startDate).format('YYYY-MM-DD hh:mm')}</td> */}

                      <td>
                        <Button
                          onClick={() => {
                            setIsEditing(true)
                            formik.setValues({
                              name: item?.name,
                              invest: item?.invest,
                              startDate: setDateHandler(item?.startDate)
                            })
                            setIsOpen(true)
                            setImageUrl(item.image)
                            setCompetition(item?._id)
                          }}
                          icon='ModeEdit'
                        ></Button>
                        <Button
                          onClick={() => {
                            setEditPanel(true)
                            setCompetition(item?._id)
                          }}
                          icon='Preview'
                        ></Button>
                        <Button
                          onClick={() => {
                            // deleteCompetition(item?._id)
                            setCompetition(item?._id)
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
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} titleId='Add-competition'>
          <ModalHeader
            setIsOpen={setIsOpen}
          >
            <ModalTitle id='Add-competition' className='d-flex align-items-end'>
              {" "}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className='h3 text-center'>{isEditing ? "Edit Competition" : "Add Competition"}</div>
            <div className='row'>
              <div>
              </div>
              <div className='col-md-6 py-2'>
                <FormGroup
                  id='name'
                  isFloating
                  label='Name'
                >
                  <Input
                    type='text'
                    value={formik.values.name}
                    isTouched={formik.touched.name}
                    invalidFeedback={
                      formik.errors.name
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
                  id='invest'
                  isFloating
                  label='Invest'
                >
                  <Input
                    type='text'
                    value={formik.values.invest}
                    isTouched={formik.touched.invest}
                    invalidFeedback={
                      formik.errors.invest
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
                  id='startDate'
                  isFloating
                  label='Start Date'
                >
                  <Input
                    type='datetime-local'
                    value={formik.values.startDate}
                    isTouched={formik.touched.startDate}
                    invalidFeedback={
                      formik.errors.startDate
                    }
                    validFeedback='Looks good!'
                    isValid={formik.isValid}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min={getCurrentDateTime()}
                  />
                </FormGroup>
              </div>
            </div>
            <FormGroup
              id='images'
              label='images'
            >
              <Input
                type='file'
                onChange={(e) => {
                  setFile(e?.target?.files[0])
                  if (e?.target?.files[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImageUrl(reader.result);
                    };

                    reader.readAsDataURL(e?.target?.files[0]);
                  }
                }}
                validFeedback='Looks good!'
              />
            </FormGroup>
            {
              imageUrl ? (
                <div className='d-flex justify-content-center py-3'>
                  <img src={imageUrl} alt="competition image" style={{
                    width: "100px"
                  }} />
                </div>
              ) : (
                <></>
              )
            }

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
              // isDisable={() => {
              //   if(isEditing){
              //     return !!imageUrl.length
              //   }
              //   return !!Object.keys(formik.errors).length || !file?.name
              // }}
              isDisable={isEditing ? !imageUrl.length : !!Object.keys(formik.errors).length || !file?.name}

              onClick={formik.handleSubmit}
            >
              {isEditing ? "Update Competition" : "Create Competition"}
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
            <div className='h3 text-center'>{"Delete Competition"}</div>
            <div className='row pt-3'>
              <p>Are you sure you want to delete this competition ?</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button icon='Close' color='danger' isLink onClick={() => {
              setCompetition("")
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
                deleteCompetition(competition)
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
              {"Competition"}
            </OffCanvasTitle>
          </OffCanvasHeader>
          <OffCanvasBody>
            <div>
              <div className='d-flex justify-content-center'>
                <img src={competitionData.image}
                  style={{
                    width: "200px"
                  }}
                  alt="competition image" />
              </div>
              <div className='row '>
                <div className='d-flex justify-content-center py-2'>
                  <p className='h5 fw-bold'>
                    Name :
                  </p>
                  <p
                    className='h5'
                  >
                    {competitionData?.name}
                  </p>
                </div>
                <div className='d-flex justify-content-center py-2'>
                  <p className='h5 fw-bold'>
                    Invest :
                  </p>
                  <p className='h5 '>
                    {competitionData?.invest}
                  </p>
                </div>
                <div className='d-flex justify-content-center py-2'>
                  <p className='h5 fw-bold'>
                    Start Time :
                  </p>
                  <p className='h5'>
                    {moment(competitionData.startDate).format('YYYY-MM-DD HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          </OffCanvasBody>
          <div className='p-3'>

          </div>
        </OffCanvas>
      </Page>
    </PageWrapper >
  )
}

export default CompetitionPage