import { FormEvent, useEffect, useState } from 'react';

const Signup = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [emailAlert, setEmailAlert] = useState<boolean>(false);
  const [textAlert, setTextAlert] = useState<boolean>(false);

  useEffect(() => {
    console.log(emailAlert);
  }, [emailAlert]);
  /* 
const checkValidity = (name: keyof signupUser) => {
    let newErrors = errors;
    if (name === 'password') {
      if (formData[name].length < 5) newErrors[name] = true;
      else newErrors[name] = false;
    } else if (name === 'confirm-password') {
      if (formData[name] !== formData.password) newErrors[name] = true;
      else newErrors[name] = false;
    } else if (formData[name].length === 0) newErrors[name] = true;
    else newErrors[name] = false;
    setErrors(newErrors);
  };
 */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          emailAlert,
          textAlert,
        }),
      });
      console.log(response);
      if (response.ok) console.log('OK');
      else console.log('Failed');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="signup">
      <h1>Signup</h1>
      <form action="" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            required
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            name="phone"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="confirmPass"> Confirm Password:</label>
          <input
            type="password"
            name="confirmPass"
            required
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            type="checkbox"
            name="emailAlert"
            onChange={() => setEmailAlert(!emailAlert)}
          />
          <label htmlFor="emailAlert">I want to receive emails.</label>
        </div>
        <div className="form-field">
          <input
            type="checkbox"
            name="textAlert"
            onChange={() => setTextAlert(!textAlert)}
          />
          <label htmlFor="textAlert">I want to receive texts.</label>
        </div>
        <button>Signup</button>
      </form>
    </section>
  );
};

export default Signup;
