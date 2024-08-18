/*eslint-disable*/
import {
    Grid, Divider, Stack, InputLabel,
MenuItem,
FormControl,
Select} from '@mui/material'

import PrayerCard from './PrayerCard'
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/dist/locale/ar'
moment.locale("ar");
export default  function MainContent() {
    const t = moment();
    const [timer, setTimer] = useState(10);
    const [city, setCity] = useState(
        { apiName: "cairo", displayName: "القاهرة" }
    );
    const [timings, setTimings] = useState({
        Fajr:"05:01",
        Dhuhr:"13:01",
        Asr:"16:39",
        Maghrib:"19:48",
        Isha:"21:01",
    });
    const [date, setDate] = useState('');
    const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
    const [remainTime,setRemainTime] = useState("");
    let cardConntent = [
        {
            id:1,
            prayer: "الفجر",
            time: timings.Fajr,
            image: "src/assets/fajr-prayer.png"
        },
        {
            id:2,
            prayer: "الضهر",
            time: timings.Dhuhr,
            image: "src/assets/dhhr-prayer-mosque.png"
        },
        {
            id:3,
            prayer: "العصر",
            time: timings.Asr,
            image: "src/assets/asr-prayer-mosque.png"
        },
        {
            id:4,
            prayer: "المغرب",
            time: timings.Maghrib,
            image: "src/assets/sunset-prayer-mosque.png"
        },
        {
            id:5,
            prayer: "العشاء",
            time: timings.Isha,
            image: "src/assets/night-prayer-mosque.png"
        },
    ];
    const cities = [
        { apiName: "cairo", displayName: "القاهرة",key:"القاهرة" },
        { apiName: "sohag", displayName: "سوهاج",key:"سوهاج" },
        { apiName: "qena", displayName: "قنا",key:"قنا" },
    ];
    const prayersArray = [
        {key : "Fajr", displayName:"الفجر"},
        {key : "Dhuhr", displayName:"الضهر"},
        {key : "Asr", displayName:"العصر"},
        {key : "Maghrib", displayName:"المغرب"},
        {key : "Isha", displayName:"العشاء"},
    ]
    const handleChange = (event) => {
        const city = cities.find((city) => {
            return city.apiName == event.target.value;
            
      })
        setCity(city);
        getTimings();
    };
    
    async function getTimings(){
        const data = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${city.apiName}&country=Egypt&method=2`);
        setTimings(data.data.data.timings);
        setDate(t.format("MMM D Y | h:mm"))
    }
    useEffect(() => {
        getTimings();
        
    }, [city]);
    useEffect(() => { 
        let interval = setInterval(() => {
             setupCoundownTimer();
        }, 1000)
       
        return () =>{
            clearInterval(interval);
        }
    }, [timings])
    const setupCoundownTimer = () => {
        const momentNow = moment();
        let nextPrayer = 2;
        if (momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) && momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))) {
            nextPrayer = 1;
        } else if (momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) && momentNow.isBefore(moment(timings["Asr"], "hh:mm"))) {
            nextPrayer = 2;
        }
        else if (momentNow.isAfter(moment(timings["Asr"], "hh:mm")) && momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))) {
            nextPrayer = 3;
        }
        else if (momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) && momentNow.isBefore(moment(timings["Isha"], "hh:mm"))) {
            nextPrayer = 4;
        } else {
            nextPrayer = 0;
        }
        setNextPrayerIndex(nextPrayer);
        const nextPrayerObj = prayersArray[nextPrayerIndex];
        const nextPrayerTime = timings[nextPrayerObj.key]
        const remainTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
        const durationRemainTime = moment.duration(remainTime);

        setRemainTime(`${durationRemainTime.seconds()} : ${durationRemainTime.minutes()} : ${durationRemainTime.hours()}`);
    }
    
    
  return (
      <>
          <Grid container>
              <Grid item xs={6} >
                  <div>
                      <h2>{date}</h2>
                      <h1>{city.displayName}</h1> 
                  </div>
              </Grid>
              <Grid item xs={6}>
                  <div>
                      <h2>متبقى حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
                      <h1>{remainTime}</h1>
                  </div>
              </Grid>
          </Grid>

          <Divider variant="middle" />

          <Stack direction="row" style={{display:"flex",justifyContent:"space-between",marginTop:"50px"}}>
              {cardConntent.map((card) => (
                  <PrayerCard key={card.id} prayer={card.prayer} time={card.time} image={card.image} />
              ))}
          </Stack>

          <Stack direction="row">
                <FormControl style={{width:"20%",margin:"0 auto",marginTop:"20px"}}>
                    <InputLabel id="demo-simple-select-label">المدينة</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={city.apiName}
                    label="المدينة"
                    onChange={handleChange}
                  >
                      {cities.map((city) => {
                          return (<MenuItem value={city.apiName} key={city.key}>{city.displayName}</MenuItem>);
                      })}
                        
                    </Select>
                </FormControl>
          </Stack>

      </>
  )
}
