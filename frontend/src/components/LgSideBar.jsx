import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { signOutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { TbReportAnalytics } from "react-icons/tb";
import { MdDashboard, MdDataSaverOff, MdLogout, MdOutlinePersonAddAlt1 } from "react-icons/md";

export default function LgSideBar() {

    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if ( tabFromUrl ) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleLogout = async () => {
      try {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: 'You will be logged out of your account!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Log out!',
          cancelButtonText: 'Cancel!'
        });
        if (result.isConfirmed) {
          const res = await fetch('/api/user/sign-out',{
            method: 'POST'
          });
          const data = await res.json();
          if (res.ok) {
            toast.success('Logged out successfully!', { theme: 'colored' });
            dispatch(signOutSuccess(data));
          } else {
            toast.error(data.message);
          }
        }
      } catch (error) {
          toast.error(error.message);
      }
    };

    const handleDragStart = (e) => {
      e.preventDefault();
    };

  return (
    <Sidebar className='w-full md:w-[15rem] pb-2 no-select custom-side-bg border-r shadow-md'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          
            <Sidebar.Logo>
              <img src='' alt="Furniture logo" className='no-select' onDragStart={handleDragStart}/>
            </Sidebar.Logo>
            <Sidebar.Item icon={MdDashboard} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor="dark" className='font-semibold'>
              Dashboard
            </Sidebar.Item>
            <Link to={'/dashboard?tab=customer-data'}>
              <Sidebar.Item active={tab === 'customer-data'} as='div' className={`hover:bg-gray-200 ${tab === 'customer-data' ? 'font-semibold' : ''}`}>
                <div className='flex items-center gap-2'><MdDataSaverOff />Customer Data</div>
              </Sidebar.Item>
            </Link>
            <Link to={'/dashboard?tab=report'}>
              <Sidebar.Item active={tab === 'report'} as='div' className={`hover:bg-gray-200 ${tab === 'report' ? 'font-semibold' : ''}`}>
                <div className='flex items-center gap-2'><TbReportAnalytics />Report</div>
              </Sidebar.Item>
            </Link>
            <Link to={'/dashboard?tab=add-customer'}>
              <Sidebar.Item active={tab === 'add-customer'} as='div' className={`hover:bg-gray-200 ${tab === 'add-customer' ? 'font-semibold' : ''}`}>
                <div className='flex items-center gap-2'><MdOutlinePersonAddAlt1 />Add Customer</div>
              </Sidebar.Item>
            </Link>
            <Sidebar.Item icon={MdLogout} onClick={handleLogout} className='hover:bg-gray-200'>
              Log out
            </Sidebar.Item>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}