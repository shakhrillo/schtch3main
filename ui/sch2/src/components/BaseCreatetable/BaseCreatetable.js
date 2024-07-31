import { useState } from 'react';
import moment from 'moment';
import { Form, Alert, Table, Spinner, Modal } from 'react-bootstrap';
import BaseFileUpload from '../BaseFileUpload/BaseFileUpload';
import BaseMultiSelect from '../BaseMultiSelect/BaseMultiSelect';
import { statusData } from '../../data/users';
import { create, fetchGet } from '../../api/index'
import { timeFormat } from '../../utils/index'
import { useForm } from 'react-hook-form';

import './BaseCreateTable.css'
import axios from 'axios';


const BaseFormCreate = ({ darkMode, page, setTableData, setKey }) => {

    const date = moment().format()
    const currentDate = moment().format('DD.MM.YYYY, HH:mm')
    const time = moment().format('HH:mm')

    const [isAdd, setIsAdd] = useState(false)
    const [employeeShortcut, setEmployeeShortcut] = useState('')
    const [maschine, setMaschine] = useState([])
    const [status, setStatus] = useState('')
    const [note, setNote] = useState([])
    const [files, setFiles] = useState('')
    const [valueFile, setValueFile] = useState('')
    const [Artikelnr, setArtikelnr] = useState('')
    const [partNumber, setPartNumber] = useState('')
    const [partName, setPartName] = useState('')
    const [show, setShow] = useState(false);

    const [machine, setMachineFilter] = useState([]);

    useEffect(() => {
        fetch('http://192.168.100.23:7878/api/machines')
          .then((res) => res.json())
          .then((data) => {
            setMachineFilter(data.map((item) => item.machineQrCode));
          });
    
      }, []);

    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        mode: 'onBlur',
        shouldUseNativeValidation: true,
    });

    const handelEmployee = (e) => {
        setEmployeeShortcut(e.target.value)
    }
    const handleNote = (e) => {
        setNote([e.target.value])
    }

    const handleUpload = (e) => {
        // setFiles(Array.from(e))
        setFiles(e.target.files[0])
        setValueFile(e.target.value)
    }
    const handleClose = () => setShow(false);

    const handleSave = () => {

        const FormData = require('form-data');
        const formData = new FormData()

        formData.append('file', files)
        formData.append('date', date)
        formData.append('ma', employeeShortcut.toUpperCase())
        formData.append('operation_order_number', Artikelnr)
        formData.append('notes', note)
        formData.append('partnr', partNumber)
        formData.append('partname', partName)
        formData.append('status', status.id || 'info')
        maschine.map(item => formData.append('machine', item.name))
        console.log('formData', formData)
        // setPartName(data[0]);
        // setPartNumber(data[1]);

        setShow(true)
        create(formData).then(res => {
            if (res.status === 201) {
                setEmployeeShortcut('')
                setMaschine('')
                setStatus('')
                setNote('')
                setFiles('')
                setValueFile('')
                setArtikelnr('')
                fetchGet(page).then((res) => setTableData(res.data.items))
                setIsAdd(true)
                setInterval(() => {
                    setIsAdd(false)
                }, 3000)
                setShow(false)
                setKey('ubersicht')
                setPartName('')
                setPartNumber('')
            }
        })
    }


    const handleClear = () => {
        setEmployeeShortcut('')
        setMaschine('')
        setStatus('')
        setNote('')
        setFiles('')
        setValueFile('')
        setArtikelnr('')
        reset()
    }


    return (
        <div className='d-flex justify-content-between' >
            <Table className='my-2 ' striped bordered>
                <tbody className={`${darkMode ? '' : 'table_form'}`}>
                    <tr>
                        <td className='bg-secondary' ><h5 className={`my-1 ms-2 text-white`} >Eintrag hinzufügen</h5></td>
                    </tr>
                    <tr>
                        <td>
                            <Form.Label className={`fs-5 fw-bold ps-1 text-${darkMode ? 'white' : ''}`} >Datum / Zeit</Form.Label>
                            <Form.Control
                                size='sm'
                                className='mb-1 '
                                value={currentDate + `     Schicht // ${timeFormat(time)}`}
                                type="text"
                                placeholder="Automatically date"
                                disabled
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Form.Label className={`fs-5 fw-bold ps-1 text-${darkMode ? 'white' : ''}`} >MA Kürzel</Form.Label>
                            <Form.Control
                                className='mb-1'
                                {...register("employeeShortcut", { required: true, maxLength: 4 })}
                                onChange={handelEmployee}
                                value={employeeShortcut}
                                size='sm'
                                type="text"
                                placeholder="MA Kürzel:"
                            />
                            {errors?.employeeShortcut && <span style={{ fontSize: '12px' }} className='text-danger ms-3' >Bitte geben Sie Ihr Mitarbeiterkürzel ein.</span>}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Form.Label className={`fs-5 fw-bold ps-1 text-${darkMode ? 'white' : ''}`} >Betriebsauftragsnr</Form.Label>
                            <div className='row  align-items-center'>
                                <div className='col-4'>
                                    <Form.Control
                                        className='mb-1 fs-6 w-100'
                                        {...register("Artikelnr", {maxLength: 9 })}
                                        onChange={(e)=>{
                                            console.log('e', e.target.value);
                                            const value = e.target.value.toString();
                                            const aufnr = value.slice(0, 6);
                                            const posnr = value.slice(6, 9);
                                            axios.get(`http://192.168.100.23:4545/bauf`, {
                                                params: {
                                                    aufnr: aufnr,
                                                    posnr: Number(posnr)
                                                }
                                            }).then(({ data }) => {
                                                setPartName(data['Partname']);
                                                setPartNumber(data['Partnumber']);
                                            });
                                            setArtikelnr(e.target.value);
                                        }}
                                        value={Artikelnr}
                                        size=''
                                        type="text"
                                        placeholder="example: 811244001"
                                    />
                                        {errors?.Artikelnr && <span style={{ fontSize: '12px' }} className='text-danger ms-3' >Bitte geben Sie Ihr Mitarbeiterkürzel ein.</span>}
                                </div>
                                <div className='col-6'>
                                    {
                                        Artikelnr.length > 8 &&
                                        <div className='d-flex justify-content-evenly'>
                                            <p className='fs-5'>
                                                Artikelnr: <b>{partNumber}</b>
                                            </p>

                                            <p className='fs-5'>
                                                Artikelname: <b>{partName}</b>
                                            </p>
                                        </div>
                                    }
                                </div>

                            </div>
                        </td>
                    </tr>
                    {/* {Artikelnr.length >8?<tr>
                        <td className='d-flex justify-content-evenly'>
                            <div>
                            <p className='fs-5'>Artikelnr : <b>00202 -T2M1</b> </p>
                            <p className='fw-bold'>(Partnumber)</p>
                            </div>
                            <div>
                            <p className='fs-5'>Artikelname : <b>KC1</b>  </p>
                            <p className='fw-bold'>(Partname)</p>
                            </div>
                        </td>

                    </tr>:""} */}
                    <tr>
                        <td>
                            <div className='mb-1' >
                                <Form.Label className={`fs-5 fw-bold ps-1 text-${darkMode ? 'white' : ''}`} >Ausstattung</Form.Label>
                                <BaseMultiSelect
                                    options={machine}
                                    value={maschine}
                                    placeholder='Maschine:'
                                    select={(e) => setMaschine(e)}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className='mb-1' >
                                <Form.Label className={`fs-5 fw-bold ps-1 text-${darkMode ? 'white' : ''}`} >Status</Form.Label>
                                <Form
                                    className='ps-3 d-flex'
                                >
                                    {
                                        statusData.map(item => {
                                            return (
                                                <div key={item.id} >
                                                    <Form.Check
                                                        {...register("status", { required: true })}
                                                        className={`fs-5 text-${darkMode ? 'white' : ''}`}
                                                        inline
                                                        label={item.name}
                                                        name="group1"
                                                        type='radio'
                                                        id={item.id}
                                                        onClick={() => setStatus(item)}
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                </Form>
                                {errors?.status && <span style={{ fontSize: '12px' }} className='d-block text-danger ms-3 mt-1' > Bitte wählen Sie Ihren Status aus.</span>}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <div className='mb-1' >
                                <Form.Label className={`fs-5 fw-bold ps-1 text-${darkMode ? 'white' : ''}`} >Notiz</Form.Label>
                                <Form.Control
                                    {...register("notes", { required: true })}
                                    onChange={handleNote}
                                    value={note}
                                    as="textarea"
                                    rows={2}
                                />
                                {errors?.notes && <span style={{ fontSize: '12px' }} className='d-block text-danger ms-3 mt-1' > Bitte geben Sie Ihre Notiz ein.</span>}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className='my-0'>
                                <Form.Label className={`fs-5 fw-bold ps-1 text-${darkMode ? 'white' : ''}`} >Bild anhängen</Form.Label>
                                <BaseFileUpload value={valueFile} file={(e) => handleUpload(e)} />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className='d-flex justify-content-end'>
                                <button onClick={handleClear} className={`fw-bold px-2 py-1 me-2 ${darkMode ? 'btn_b-dark' : 'btn_b'}`} >Abbruch</button>
                                <button onClick={handleSubmit(handleSave)} className={`fw-bold px-2 py-1 ${darkMode ? 'btn_b-dark' : 'btn_b'}`} >Speichern</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </Table>
            {
                isAdd ? <Alert className='position-fixed top-10 end-0' variant='success'>
                    Erfolgreich hinzugefügt
                </Alert> : null
            }
            <Modal className='d-flex justify-content-center align-items-center spinner_modal' show={show} onHide={handleClose}>
                <Spinner animation="border" variant="light" />
            </Modal>

        </div >
    );
}

export default BaseFormCreate;
