import { useEffect, useState } from 'react';
import { Modal } from 'flowbite-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

export default function CusData() {

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/customer/get-customers');
      const data = await res.json();
      setCustomers(data);
    };

    fetchData();
  }, []);

  const handleCustomerDelete = async (cusId) => {
    const result = await Swal.fire({
      title: 'Want to delete?',
      text: "You won't be able to revert this!",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel!',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/customer/delete-customer/${cusId}`, {
          method: 'DELETE',
        });
        const data = await res.json();

        if (!res.ok) {
          console.log(data.message);
          return;
        } else {
          setCustomers(prev => prev.filter((customer) => customer.id != cusId));
          toast.success('Employee has been deleted!');
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Customer Data</h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left bg-white shadow-md rounded-lg border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6">Customer Name</th>
              <th className="py-3 px-6">Phone</th>
              <th className="py-3 px-6">Address</th>
              <th className="py-3 px-6 text-center">Total Purchase</th>
              <th className="py-3 px-6 text-center">Bill Details</th>
              {currentUser.isAdmin === 1 && (
                <th className="py-3 px-6 text-center">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6">{customer.name}</td>
                  <td className="py-3 px-6">{customer.phone}</td>
                  <td className="py-3 px-6">
                    {customer.street}, {customer.area}, {customer.pincode}
                  </td>
                  <td className="py-3 px-6 text-center">{customer.bills.length}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="text-blue-500 hover:underline"
                      // onClick={() => handleViewBills(customer)}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      View Bills
                    </button>
                  </td>
                  {currentUser.isAdmin === 1 && (
                    <td className='space-x-4 text-center'>
                      <Link to={`/dashboard/edit/${customer.id}`} className='text-green-600 cursor-pointer hover:underline'>Edit</Link>
                      <span className='text-red-600 cursor-pointer hover:underline' onClick={() => handleCustomerDelete(customer.id)}>Delete</span>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bill Details Modal */}
      {selectedCustomer && (
        <Modal show={true} onClose={() => setSelectedCustomer(null)} popup>
          <Modal.Header className='capitalize ml-4 mt-1 flowbite-modal-close'>{selectedCustomer.name}'s Bills</Modal.Header>
          <Modal.Body>
            <table className="table-auto w-full bg-gray-100 rounded-lg">
              <thead>
                <tr className="text-gray-700 text-sm sm:text-base">
                  <th className="py-2 px-4 whitespace-nowrap">Bill No</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedCustomer.bills.map((bill, billIndex) => (
                  <tr key={billIndex} className="border-t  text-center text-sm sm:text-base">
                    <td className="py-2 px-4">{bill.billNo}</td>
                    <td className="py-2 px-4">{bill.amount}</td>
                    <td className="py-2 px-4">{new Date(bill.billDate).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );

  // function handleViewBills(customer) {
  //   setSelectedCustomer(customer);
  // }
}
