import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {

  const [ formData, setFormData ] = useState({});
  const navigate =  useNavigate();
  const [loading, setLoading ] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/user/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        toast.error(data.message);
        return;
      } else {
        setLoading(false);
        toast.success('User created successfully!');
        navigate('/', { replace: true });
      };
      
    } catch (error) {
        setLoading(false);
        toast.error(error.message);
    }
  };

  const handleShow = () => {
    const show = document.getElementById('password');
    if (show.type === 'password') {
      show.type = 'text' ;
    } else {
      show.type = 'password' ;
    }
  };

  return (
    <div className='bg-slate-200 h-screen'>
      <div className="flex flex-col justify-center items-center h-full">
        <form className="flex max-w-md flex-col gap-4 w-full sm:bg-white sm:shadow-md p-5 rounded-md" onSubmit={handleSubmit}>
          <h2 className='text-3xl font-bold text-slate-700'>Furniture</h2>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Your email" />
            </div>
            <TextInput onChange={handleChange} id="email" type="email" placeholder="company@gmail.com" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Your password" />
            </div>
            <TextInput onChange={handleChange} id="password" type="password" required placeholder='**********'/>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="show" onClick={handleShow}/>
            <Label htmlFor="show">Show password</Label>
          </div>
          <Button type="submit" color="dark" disabled={loading}>
            {loading ? (
              <>
                <Spinner size='sm'/>
                <span className='pl-3'>Signing up...</span>
              </> 
              ) : 'Sign Up'
            }
          </Button>
          <p className='text-sm'>Already have an account ? <Link to='/' className='text-blue-700 hover:underline'>Sign in</Link></p>
        </form>
      </div>
    </div>
  )
}