import { useState, useEffect } from 'react';
import { AuthProps, mountainsObj } from '../types.d';
import MountainWeather from './MountainWeather';

const Forecast = ({ user }: AuthProps) => {
  const [mountains, setMountains] = useState<mountainsObj>();

  const getMountains = async () => {
    try {
      const response = await fetch('/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMountains(data.mountains);
      setContent(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMountains();
  }, [user]);

  const [content, setContent] = useState<boolean>(false);

  return (
    <section id="conditions">
      <div className="background-image"></div>
      <div className="content">
        <h1>My Mountain Forecasts</h1>
        {!user && (
          <h2 className="no-user">
            Log in to view the weather at your mountains.
          </h2>
        )}
        <div className="weather">
          {mountains &&
            Object.keys(mountains).map((key) => {
              const mountain = key as keyof mountainsObj;
              return (
                <MountainWeather
                  key={mountain}
                  name={mountain}
                  location={mountains[mountain] as number}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Forecast;
