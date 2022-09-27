import { useEffect, useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthProps, mountainsObj, daysObj, timesObj } from '../../types.d';
import { mountains as mountainsRef } from '../../mountains';
import Loading from '../Loading';

const AlertsForm = ({ user }: AuthProps) => {
  const getAccountInfo = async () => {
    try {
      const response = await fetch('/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setText(data.notifications.text);
      setEmail(data.notifications.email);
      setTimes(data.notifications.times);
      setDays(data.notifications.days);
      setMountains(data.mountains);
      setLoaded(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAccountInfo();
  }, [user]);

  const [loaded, setLoaded] = useState<boolean>(false);

  const [text, setText] = useState<boolean>(false);
  const [email, setEmail] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  const [days, setDays] = useState<daysObj | null>();
  const [selectedDay, setSelectedDay] = useState<keyof daysObj>('sunday');
  const handleDayChange = (day: keyof daysObj) => {
    let tempDays = days as daysObj;
    tempDays[day] = !tempDays[day];
    setDays({ ...tempDays });
  };

  const [times, setTimes] = useState<timesObj | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('12');
  const handleTimeChange = (time: string) => {
    let tempTimes = times as timesObj;
    let numTime = Number(time) as keyof timesObj;
    tempTimes[numTime] = !tempTimes[numTime];
    setTimes({ ...tempTimes });
  };

  const [mountains, setMountains] = useState<mountainsObj | null>();
  const [selectedMountain, setSelectedMountain] = useState<keyof mountainsObj>(
    Object.keys(mountainsRef).sort()[0] as keyof mountainsObj
  );

  const addMountain = (mountain: keyof mountainsObj) => {
    let tempMountains = mountains as mountainsObj;
    tempMountains[mountain] = mountainsRef[mountain];
    setMountains({ ...tempMountains });
  };

  const removeMountain = (mountain: keyof mountainsObj) => {
    let tempMountains = mountains as mountainsObj;
    delete tempMountains[mountain];
    setMountains({ ...tempMountains });
  };

  const [posting, setPosting] = useState<boolean>(false);
  const [posted, setPosted] = useState<boolean>(false);
  const [postError, setPostError] = useState<string>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPosted(false);
    if (user) {
      try {
        setPosting(true);
        const response = await fetch('/users', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            phone: user.phone,
            password,
            notifications: {
              text,
              email,
              times,
              days,
            },
            mountains,
          }),
        });
        if (response.ok) {
          setPostError(undefined);
          setPosted(true);
          setPassword('');
        } else if (response.status === 401) {
          setPostError('Incorrect password.');
        } else {
          setPostError('Bad request. Password incorrect');
        }
        setPosting(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <section id="alerts-form">
      {!user && <Navigate to="/" />}
      <div className="background-image"></div>
      <div className="content">
        <h1>Alert Settings</h1>
        {!loaded && <Loading />}
        {loaded && (
          <form action="" onSubmit={(e) => handleSubmit(e)}>
            <div className="checkboxes">
              <div className="form-field-check">
                <input
                  id="emailAlert"
                  type="checkbox"
                  name="emailAlert"
                  checked={email}
                  onChange={() => setEmail(!email)}
                />
                <label htmlFor="emailAlert">Email alerts</label>
              </div>
              <div className="form-field-check">
                <input
                  id="textAlert"
                  type="checkbox"
                  name="textAlert"
                  checked={text}
                  onChange={() => setText(!text)}
                />
                <label htmlFor="textAlert">Text alerts</label>
              </div>
            </div>
            <h2>Mountains</h2>
            <div className="form-field">
              <label htmlFor="mountains">Add a mountain:</label>
              <select
                id="mountains"
                name="mountains"
                value={selectedMountain}
                onChange={(e) => {
                  setSelectedMountain(e.target.value as keyof mountainsObj);
                }}
              >
                {Object.keys(mountainsRef)
                  .sort()
                  .map((key) => {
                    const mountain = key as keyof mountainsObj;
                    return (
                      <option key={mountain} value={mountain}>
                        {mountain}
                      </option>
                    );
                  })}
              </select>
              <button
                type="button"
                onClick={() => addMountain(selectedMountain)}
              >
                Add
              </button>
            </div>
            {mountains && Object.keys(mountains).length === 0 && (
              <p>You haven't selected any mountains.</p>
            )}
            {mountains && (
              <ol>
                {Object.keys(mountains).map((key) => {
                  const mountain = key as keyof mountainsObj;
                  return (
                    <li key={mountain}>
                      {mountain}{' '}
                      <button
                        type="button"
                        onClick={() => removeMountain(mountain)}
                      >
                        x
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
            <h2>Days</h2>
            <div className="form-field">
              <label htmlFor="days">Add a day:</label>
              <select
                id="days"
                name="days"
                value={selectedDay}
                onChange={(e) => {
                  setSelectedDay(e.target.value as keyof daysObj);
                }}
              >
                {days &&
                  Object.keys(days).map((key) => {
                    const day = key as keyof daysObj;
                    return (
                      <option key={day} value={day}>
                        {day.charAt(0).toLocaleUpperCase() + day.slice(1)}
                      </option>
                    );
                  })}
              </select>
              <button
                type="button"
                onClick={() => handleDayChange(selectedDay)}
              >
                Add
              </button>
            </div>
            {days && (
              <ol>
                {Object.keys(days).map((key) => {
                  const day = key as keyof daysObj;
                  if (days[day]) {
                    return (
                      <li key={day}>
                        {day.charAt(0).toLocaleUpperCase() + day.slice(1)}{' '}
                        <button
                          type="button"
                          onClick={() => handleDayChange(day)}
                        >
                          x
                        </button>
                      </li>
                    );
                  }
                })}
              </ol>
            )}
            <h2>Times {'(MDT)'}</h2>
            <div className="form-field">
              <label htmlFor="times">Add a time:</label>
              <select
                id="times"
                name="times"
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                }}
              >
                {times &&
                  Object.keys(times).map((key) => {
                    const time = key as any;
                    return (
                      <option key={time} value={time}>
                        {time}:00
                      </option>
                    );
                  })}
              </select>
              <button
                type="button"
                onClick={() => handleTimeChange(selectedTime)}
              >
                Add
              </button>
            </div>
            {times && (
              <ol>
                {Object.keys(times).map((key) => {
                  const time = Number(key) as keyof timesObj;
                  if (times[time]) {
                    return (
                      <li key={time}>
                        {time}:00{' '}
                        <button
                          type="button"
                          onClick={() => handleTimeChange(key)}
                        >
                          x
                        </button>
                      </li>
                    );
                  }
                })}
              </ol>
            )}
            <div className="form-field-pass">
              <label htmlFor="currentPass">Password: </label>
              <input
                id="currentPass"
                type="password"
                name="currentPass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!posting && <button className="submit">Save</button>}
            </div>
            {posting && (
              <div className="posting">
                <div className="spinner"></div>
              </div>
            )}
            {postError && <p className="post-error">{postError}</p>}
            {posted && (
              <p className="posted">Alert settings updated successfully.</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
};

export default AlertsForm;
