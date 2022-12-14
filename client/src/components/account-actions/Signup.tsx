import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');

  const [nameErr, setNameErr] = useState<string>();
  const [emailErr, setEmailErr] = useState<string>();
  const [phoneErr, setPhoneErr] = useState<string>();
  const [passwordErr, setPasswordErr] = useState<string>();
  const [confirmPassErr, setConfirmPassErr] = useState<string>();

  const [emailAlert, setEmailAlert] = useState<boolean>(false);
  const [textAlert, setTextAlert] = useState<boolean>(false);

  const [posting, setPosting] = useState<boolean>(false);
  const [posted, setPosted] = useState<boolean>(false);
  const [postResponse, setPostResponse] = useState<string>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPosting(true);
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
          notifications: {
            text: textAlert,
            email: emailAlert,
            times: {
              0: false,
              1: false,
              2: false,
              3: false,
              4: false,
              5: false,
              6: false,
              7: false,
              8: false,
              9: false,
              10: false,
              11: false,
              12: false,
              13: false,
              14: false,
              15: false,
              16: false,
              17: false,
              18: true,
              19: false,
              20: false,
              21: false,
              22: false,
              23: false,
            },
            days: {
              sunday: true,
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: true,
            },
          },
        }),
      });
      if (response.ok) {
        setPostResponse(undefined);
        setPosted(true);
      } else if (response.status === 400) {
        setPostResponse('That email is already in use.');
      } else {
        setPostResponse('Error creating account. Please try again.');
      }
      setPosting(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="signup">
      <div className="background-image"></div>
      <div className="content">
        <h1>Create Account</h1>
        <form action="" onSubmit={handleSubmit} noValidate>
          <Link to="/login">Already have an account? Log in.</Link>
          <p>* Required field</p>
          <div className="form-field">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              aria-label="name"
              type="text"
              name="name"
              required
              onChange={(e) => setName(e.target.value)}
              onBlur={(e) => {
                e.target.className = 'touched';
                name === ''
                  ? setNameErr('Enter your first name.')
                  : setNameErr(undefined);
              }}
            />
            {nameErr && <p className="error">{nameErr}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              aria-label="email"
              type="email"
              name="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => {
                e.target.className = 'touched';
                !email.match(
                  /([a-zA-Z0-9+._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
                )
                  ? setEmailErr('Enter a valid email.')
                  : setEmailErr(undefined);
              }}
            />
            {emailErr && <p className="error">{emailErr}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              aria-label="phone"
              type="tel"
              name="phone"
              onChange={(e) => setPhone(e.target.value)}
              onBlur={(e) => {
                e.target.className = 'touched';
                phone.match(/[a-zA-Z]/gi)
                  ? setPhoneErr('Phone number cannot contain letters.')
                  : setPhoneErr(undefined);
              }}
            />
            {phoneErr && <p className="error">{phoneErr}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              aria-label="password"
              type="password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => {
                e.target.className = 'touched';
                !password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/gi)
                  ? setPasswordErr(
                      'Password must be at least 6 characters with 1 letter and 1 number.'
                    )
                  : setPasswordErr(undefined);
              }}
            />
            {passwordErr && <p className="error">{passwordErr}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="confirmPass"> Confirm Password *</label>
            <input
              id="confirmPass"
              aria-label="confirm-password"
              type="password"
              name="confirmPass"
              required
              onChange={(e) => setConfirmPass(e.target.value)}
              onBlur={(e) => {
                e.target.className = 'touched';
                password !== confirmPass
                  ? setConfirmPassErr("Passwords don't match.")
                  : setConfirmPassErr(undefined);
              }}
            />
            {confirmPassErr && <p className="error">{confirmPassErr}</p>}
          </div>
          <div className="form-field-check">
            <input
              type="checkbox"
              name="emailAlert"
              onChange={() => setEmailAlert(!emailAlert)}
            />
            <label htmlFor="emailAlert">I want to receive email alerts.</label>
          </div>
          <div className="form-field-check">
            <input
              type="checkbox"
              name="textAlert"
              onChange={() => setTextAlert(!textAlert)}
            />
            <label htmlFor="textAlert">I want to receive text alerts.</label>
          </div>
          <p className="checkbox-msg">&#40; You can change these later &#41;</p>
          {!posting && !posted && <button>Create Account</button>}
          {posting && (
            <div className="posting">
              <div className="spinner"></div>
            </div>
          )}
          {postResponse && <p className="response">{postResponse}</p>}
          {posted && (
            <Link to="/login" className="login">
              Account successfully created. Log In
            </Link>
          )}
        </form>
      </div>
    </section>
  );
};

export default Signup;
