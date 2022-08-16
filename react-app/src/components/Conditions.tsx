import { useEffect, useState } from 'react';
import { AuthProps, mountainsObj } from '../types.d';
import MountainWeather from './MountainWeather';

const Conditions = ({ user }: AuthProps) => {
  return (
    <section id="conditions">
      <h1>Your Mountain Forecasts</h1>
      {user &&
        Object.keys(user.mountains).map((key) => {
          const mountain = key as keyof mountainsObj;
          if (user.mountains[mountain] == 0) return;
          console.log(mountain);
          console.log(user.mountains[mountain]);
          return (
            <MountainWeather
              key={mountain}
              name={mountain}
              location={user.mountains[mountain]}
            />
          );
        })}
    </section>
  );
};

export default Conditions;
