import { useEffect, useState, FormEvent, KeyboardEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthProps } from '../../types.d';
import Loading from '../Loading';

const AccountInfoForm = ({ user }: AuthProps) => {
  const getAccountInfo = async () => {
    try {
      const response = await fetch('/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setName(data.name);
      setEmail(data.email);
      setNewEmail(data.email);
      setPhone(data.phone);
      setLoaded(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAccountInfo();
  }, [user]);

  const [loaded, setLoaded] = useState<boolean>(false);

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>('');

  const [name, setName] = useState<string>();
  const [newEmail, setNewEmail] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const [newPass, setNewPass] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');

  const [editName, setEditName] = useState<boolean>(false);
  const [editEmail, setEditEmail] = useState<boolean>(false);
  const [editPhone, setEditPhone] = useState<boolean>(false);
  const [editPass, setEditPass] = useState<boolean>(false);

  const [nameErr, setNameErr] = useState<string>();
  const [emailErr, setEmailErr] = useState<string>();
  const [phoneErr, setPhoneErr] = useState<string>();
  const [passwordErr, setPasswordErr] = useState<string>();
  const [confirmPassErr, setConfirmPassErr] = useState<string>();

  // Set hooks to watch state of each form value & throw appropriate errors
  useEffect(() => {
    name === '' ? setNameErr('Enter a name.') : setNameErr(undefined);
  }, [name]);

  useEffect(() => {
    !newEmail?.match(/([a-zA-Z0-9+._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
      ? setEmailErr('Enter a valid email.')
      : setEmailErr(undefined);
  }, [newEmail]);

  useEffect(() => {
    phone?.match(/[a-zA-Z]/gi)
      ? setPhoneErr('Phone number cannot contain letters.')
      : setPhoneErr(undefined);
  }, [phone]);

  useEffect(() => {
    if (newPass || confirmPass) {
      !newPass?.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/gi)
        ? setPasswordErr('6+ characters with 1 letter and 1 number.')
        : setPasswordErr(undefined);
      newPass !== confirmPass
        ? setConfirmPassErr("Passwords don't match.")
        : setConfirmPassErr(undefined);
    }
  }, [newPass, confirmPass]);

  // Set general error value to true if any form value throws an error
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (nameErr || emailErr || phoneErr || passwordErr || confirmPassErr)
      setError(true);
    else setError(false);
  }, [nameErr, emailErr, phoneErr, passwordErr, confirmPassErr]);

  const [posting, setPosting] = useState<boolean>(false);
  const [posted, setPosted] = useState<boolean>(false);
  const [postError, setPostError] = useState<string>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPosted(false);
    if (!error) {
      try {
        setPosting(true);
        const response = await fetch('/users', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            newEmail,
            phone,
            newPass,
            password,
          }),
        });
        if (response.ok) {
          setPostError(undefined);
          setPosted(true);
          setPassword('');
        } else if (response.status === 401) {
          setPostError('Incorrect password.');
        } else {
          setPostError('Error updating account. Please try again.');
        }
        setPosting(false);
      } catch (err) {
        console.error(err);
      }
    } else {
      setPostError("Can't submit form with errors. ");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      target.blur();
    }
  };

  return (
    <section id="account-info-form">
      {!user && <Navigate to="/" />}
      <div className="background-image"></div>

      <div className="content">
        <h1>Account Info</h1>
        {!loaded && <Loading />}
        {loaded && (
          <form action="" onSubmit={(e) => handleSubmit(e)}>
            <div data-testid="name" className="form-field">
              <label htmlFor="name">Name: </label>
              {!editName && (
                <>
                  <p>{name}</p>
                  <button type="button" onClick={() => setEditName(true)}>
                    <img
                      src={
                        require('../../assets/icons/icons8-edit.svg').default
                      }
                      alt="Edit"
                    ></img>
                  </button>
                </>
              )}
              {editName && (
                <>
                  <input
                    type="text"
                    name="name"
                    autoFocus
                    value={name}
                    onChange={(e) => {
                      e.target.className = 'touched';
                      setName(e.target.value);
                    }}
                    onBlur={() => (!nameErr ? setEditName(false) : null)}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                  {nameErr && <p className="error">{nameErr}</p>}
                  <button
                    type="button"
                    onClick={() => (!nameErr ? setEditName(false) : null)}
                  >
                    <img
                      src={
                        require('../../assets/icons/icons8-done.svg').default
                      }
                      alt="Done"
                    ></img>
                  </button>
                </>
              )}
            </div>
            <div data-testid="email" className="form-field">
              <label htmlFor="email">Email: </label>
              {!editEmail && (
                <>
                  <p>{newEmail}</p>
                  <button type="button" onClick={() => setEditEmail(true)}>
                    <img
                      src={
                        require('../../assets/icons/icons8-edit.svg').default
                      }
                      alt="Edit"
                    ></img>
                  </button>
                </>
              )}
              {editEmail && (
                <>
                  <input
                    type="email"
                    name="email"
                    autoFocus
                    value={newEmail}
                    onChange={(e) => {
                      e.target.className = 'touched';
                      setNewEmail(e.target.value);
                    }}
                    onBlur={() => (!emailErr ? setEditEmail(false) : null)}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                  {emailErr && <p className="error">{emailErr}</p>}
                  <button
                    type="button"
                    onClick={() => (!emailErr ? setEditEmail(false) : null)}
                  >
                    <img
                      src={
                        require('../../assets/icons/icons8-done.svg').default
                      }
                      alt="Done"
                    ></img>
                  </button>
                </>
              )}
            </div>
            <div data-testid="phone" className="form-field">
              <label htmlFor="phone">Phone: </label>
              {!editPhone && (
                <>
                  <p>{phone}</p>
                  <button type="button" onClick={() => setEditPhone(true)}>
                    <img
                      src={
                        require('../../assets/icons/icons8-edit.svg').default
                      }
                      alt="Edit"
                    ></img>
                  </button>
                </>
              )}
              {editPhone && (
                <>
                  <input
                    type="tel"
                    name="phone"
                    autoFocus
                    value={phone}
                    onChange={(e) => {
                      e.target.className = 'touched';
                      setPhone(e.target.value);
                    }}
                    onBlur={() => (!phoneErr ? setEditPhone(false) : null)}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                  {phoneErr && <p className="error">{phoneErr}</p>}
                  <button
                    type="button"
                    onClick={() => (!phoneErr ? setEditPhone(false) : null)}
                  >
                    <img
                      src={
                        require('../../assets/icons/icons8-done.svg').default
                      }
                      alt="Done"
                    ></img>
                  </button>
                </>
              )}
            </div>
            <div data-testid="newPass" className="form-field">
              <label htmlFor="newPass">Password: </label>
              {!editPass && (
                <>
                  <p>{newPass ? '*'.repeat(newPass.length) : '******'}</p>
                  <button
                    data-testid="pass-button"
                    type="button"
                    onClick={() => setEditPass(true)}
                  >
                    <img
                      src={
                        require('../../assets/icons/icons8-edit.svg').default
                      }
                      alt="Edit"
                    ></img>
                  </button>
                </>
              )}
              {editPass && (
                <>
                  <input
                    data-testid="pass-input"
                    type="password"
                    name="newPass"
                    autoFocus
                    value={newPass}
                    onChange={(e) => {
                      e.target.className = 'touched';
                      setNewPass(e.target.value);
                    }}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                  {passwordErr && <p className="error">{passwordErr}</p>}
                  <button
                    data-testid="pass-button"
                    type="button"
                    onClick={() =>
                      !passwordErr && !confirmPassErr
                        ? setEditPass(false)
                        : null
                    }
                  >
                    <img
                      src={
                        require('../../assets/icons/icons8-done.svg').default
                      }
                      alt="Done"
                    ></img>
                  </button>
                </>
              )}
            </div>
            {editPass && (
              <div data-testid="confirmPass" className="form-field">
                <label htmlFor="confirmPass"> Confirm Password: </label>
                <input
                  data-testid="confirm-pass-input"
                  type="password"
                  name="confirmPass"
                  value={confirmPass}
                  onChange={(e) => {
                    e.target.className = 'touched';
                    setConfirmPass(e.target.value);
                  }}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
                {confirmPassErr && <p className="error">{confirmPassErr}</p>}
              </div>
            )}
            <div data-testid="currentPass" className="form-field">
              <label htmlFor="currentPass">Current Password: </label>
              <input
                type="password"
                name="currentPass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!posting && <button className="submit">Save</button>}
              {posting && (
                <div className="posting">
                  <div className="spinner"></div>
                </div>
              )}
            </div>
            {postError && <p className="post-error">{postError}</p>}
            {posted && <p className="posted">Account updated successfully.</p>}
          </form>
        )}
      </div>
    </section>
  );
};

export default AccountInfoForm;
