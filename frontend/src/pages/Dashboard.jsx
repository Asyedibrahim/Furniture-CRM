import LgSideBar from '../components/LgSideBar';
import SmSideBar from '../components/SmSideBar';
import CusData from '../dashboard/CusData';
import Report from '../dashboard/Report';
import AddCustomer from '../dashboard/AddCustomer';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {

  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');

    if (tabFromUrl) {
      setTab(tabFromUrl)
    } else {
      setTab('customer-data')
    };

  }, [location.search]);

  return (
    <div className='flex flex-col lg:flex-row min-h-screen'>

      {/* SideBar large device */}
      <div className='lg:w-60 hidden lg:inline'>
        <LgSideBar />
      </div>

      {/* SideBar small device */}
      <div className="lg:hidden">
        <SmSideBar />
      </div>

      {/* Customer Data... */}
      {tab === 'customer-data' && <CusData />}
      {/* Customer Data... */}
      {tab === 'report' && <Report />}
      {/* Customer Data... */}
      {tab === 'add-customer' && <AddCustomer />}

    </div>
  )
}
