import { data } from '../mock/data';
import { Link } from 'react-router-dom';

import logo from '../assets/images/KTB_Logo_rigth.png';
import ktbuLogo from '../assets/images/KTBU.svg';

const MitteilungTable = () => {
  return (
    <>
      <div className='d-flex p-2 justify-content-between align-items-center'>
        <div className='d-flex align-items-center gap-2'>
          <img width={75} src={ktbuLogo} alt='' />
          <h2 className='text-blue'>
            <i>KTBU Link HUB</i>
          </h2>
        </div>

        <img width={130} src={logo} alt='' />
      </div>
      <div className='row align-items-center border border-primary full-screen p-2 mt-2'>
        {data?.map((item, index) => (
          <Link
            className='col-md-4 col-sm-6'
            style={{ textDecoration: 'none' }}
            to={item.link}
          >
            <div
              key={index}
              className='py-5 border border-2 border-primary text-center mt-2'
            >
              <img width={75} src={item?.logo} alt={item.logo} />
              <h3 className='text-blue mt-4'>{item.text}</h3>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default MitteilungTable;
