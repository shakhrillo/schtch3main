import { useState } from 'react';
import { Form, Navbar } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { postNotice } from '../services/notice/notice';
import { clearInputs } from '../utils';

import letterImage from '../assets/images/email.svg';
import logo from '../assets/images/KTB_Logo_rigth.png';

const NoticeBox = () => {
  const navigate = useNavigate();
  const [showNameInput, setShowNameInput] = useState(false);
  const [showCurrent, _setShowCurrent] = useState(true);
  const [regarding, setRegarding] = useState('');
  const [full_name, setFullName] = useState('');
  const [notice, setNotice] = useState('');

  const handleRadioChange = (e: any) => {
    setShowNameInput(e.target.value === 'yes');
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      regarding,
      full_name,
      notice,
    };
    if (!regarding || !notice) {
      toast.error('Füllen Sie die Lücke');
      return;
    }
    postNotice(data)
      .then((res) => {
        console.log(res);
        clearInputs([setFullName, setNotice, setRegarding]);
        toast.success('Erfolgreich');
        setTimeout(() => {
          navigate('/');
        }, 2000);
        setShowNameInput(false);
      })
      .catch(() => {
        toast.error('Füllen Sie die Lücke');
      });
  };

  const cancel = () => {
    clearInputs([setFullName, setNotice, setRegarding]);
    navigate('/');
  };

  return (
    <div className='container py-3'>
      <ToastContainer autoClose={1500} />
      <div className='content'>
        <div className='d-flex align-items-center justify-content-between'>
          <div className='d-flex gap-3'>
            <img width={75} src={letterImage} alt='' />
            <div className='d-flex align-items-center text-align-center '>
              <h1>||</h1>
              <h3 className='fs-1'>Mitteilungsbox</h3>
              <h1>||</h1>
            </div>
          </div>
          <img width={160} src={logo} alt='' />
        </div>

        <Navbar className='bg-blue mt-2' variant='dark'>
          <Navbar.Toggle />
          <Navbar.Collapse className='justify-content-start p-3'></Navbar.Collapse>
        </Navbar>

        {showCurrent && (
          <div className='mt-4'>
            <Form onSubmit={handleSubmit} className='mt-2 '>
              <div className='border border-primary'>
                <div className='bg-secondary w-100 p-3'>
                  <i className='text-light'>
                    Anonyme oder persönlich Mitteilungen jeglicher Angelegenheit
                    direkt an die Geschäftsführung.
                  </i>
                </div>
                <div className='p-2'>
                  <Form.Group
                    className='mb-3'
                    controlId='exampleForm.ControlTextarea1'
                  >
                    <Form.Label className='fw-bold'>Betreff</Form.Label>
                    <Form.Control
                      value={regarding}
                      onChange={(e) => setRegarding(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className='border border-primary my-2 p-2'>
                <Form.Group
                  className='mb-3'
                  controlId='exampleForm.ControlTextarea2'
                >
                  <Form.Label className='fw-bold'>
                    Möchten Sie Ihren Namen angeben?
                  </Form.Label>
                  <div>
                    <Form.Check
                      type='radio'
                      id='radio-yes'
                      label='Ja'
                      name='nameChoice'
                      value='yes'
                      className='me-3'
                      onChange={handleRadioChange}
                    />
                    <Form.Check
                      type='radio'
                      id='radio-no'
                      label='Nein'
                      name='nameChoice'
                      value='no'
                      onChange={handleRadioChange}
                    />
                  </div>
                </Form.Group>

                {showNameInput && (
                  <Form.Group
                    className='mb-3'
                    controlId='exampleForm.ControlTextarea3'
                  >
                    <Form.Label className='fw-bold'>Name</Form.Label>
                    <Form.Control
                      value={full_name}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Form.Group>
                )}
              </div>

              <div className='p-2 border border-primary'>
                <Form.Group
                  className='mb-3'
                  controlId='exampleForm.ControlTextarea1'
                >
                  <Form.Label className='fw-bold'>Mitteilung</Form.Label>
                  <Form.Control
                    value={notice}
                    rows={6}
                    onChange={(e) => setNotice(e.target.value)}
                    as='textarea'
                  />
                </Form.Group>
              </div>

              <div className='d-flex gap-2 mt-4 justify-content-end'>
                <button
                  onClick={cancel}
                  type='button'
                  className='btn btn-primary text-white fw-bold'
                >
                  Abbrechen
                </button>
                <button
                  type='submit'
                  className='btn btn-primary text-white fw-bold'
                >
                  Seichern
                </button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBox;
