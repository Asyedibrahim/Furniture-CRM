import { useEffect, useState } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function EditCustomer() {

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    area: '',
    pincode: '',
  });
  const [bills, setBills] = useState([{ billNo: '', amount: '', date: '' }]);
  const { cusId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
        const res = await fetch(`/api/customer/getCustomer/${cusId}`);
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message);
            return;
        } else {
            setFormData(data);
            const { bills } = data;
            setBills(bills || [])
        }
    }
    if (currentUser.isAdmin === 1) {
        fetchCustomer();
    }
  }, [cusId, currentUser])

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleBillChange = (index, e) => {
    const { name, value } = e.target;
    const newBills = [...bills];
    newBills[index][name] = value;
    setBills(newBills);
  };

  const handleAddBill = () => {
    setBills([ 
      ...bills, 
      { billNo: '', amount: '', date: '' }
    ]);
  };

  const handleDeleteBill = (index) => {
    setBills(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customerData = { ...formData, bills };
      
      if (!customerData.name || !customerData.phone || !customerData.street || !customerData.area || !customerData.pincode) {
        toast.error('All customer fields are required!');
        return;
      }

      const res = await fetch(`/api/customer/update-customer/${cusId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      } else {
        toast.success('Customer details updated!');
        navigate('/dashboard?tab=customer-data', { replace: true });
      }
    } catch (error) {
      toast.error(error.message);
    };
  };

  return (
    <div className="p-4 md:bg-gray-100">
      <div className="bg-white sm:shadow-md rounded-lg sm:p-6 container mx-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Customer Name */}
          <div>
            <Label>Customer Name</Label>
            <TextInput type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Enter customer name" className="mt-1" />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <TextInput type="text" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="Enter phone number" className="mt-1" />
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Street</Label>
              <TextInput type="text" name="street" value={formData.street || ''} onChange={handleChange}placeholder="Enter street" className="mt-1" />
            </div>

            <div>
              <Label>Area</Label>
              <TextInput type="text" name="area" value={formData.area || ''} onChange={handleChange} className="mt-1" placeholder="Enter area" />
            </div>

            <div>
              <Label>Pincode</Label>
              <TextInput type="text" name="pincode" value={formData.pincode || ''} onChange={handleChange} className="mt-1" placeholder="Enter pincode" />
            </div>
          </div>

          {/* Bills Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Bills</h3>
            {bills.map((bill, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 relative border border-slate-300 p-3 rounded-md">
                <div>
                  <Label>Bill No {index + 1}</Label>
                  <TextInput type="text" name="billNo" value={bill.billNo || ''} onChange={(e) => handleBillChange(index, e)} className="mt-1" placeholder="Enter bill number" />
                </div>

                <div>
                  <Label>Amount</Label>
                  <TextInput type="text" name="amount" value={bill.amount || ''} onChange={(e) => handleBillChange(index, e)} className="mt-1" placeholder="Enter amount" />
                </div>

                <div>
                  <Label>Date</Label>
                  <TextInput type="date" name="date" value={bill.date || ''} onChange={(e) => handleBillChange(index, e)} className="mt-1" />
                </div>

                {/* Delete button */}
                <Button type="button" onClick={() => handleDeleteBill(index)} className="absolute top-0 right-0 mt-2 mr-2" color='failure' size='xs'>
                  <MdDelete className='w-[13px] h-[13px]'/>
                </Button>
              </div>
            ))}

            {/* Button to Add Another Bill */}
            <Button type="button" onClick={handleAddBill} color='blue' size='sm'>
              Add Another Bill
            </Button>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <Button type="submit" color='success' className='w-full'>
              Update Customer
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
