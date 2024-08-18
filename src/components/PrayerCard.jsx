/*eslint-disable*/
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function PrayerCard({prayer,time,image,id}) {
  return (
    <Card sx={{ maxWidth: 345 }} key={id}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt="Mosque Image"
        />
        <CardContent>
          <h2>
            {prayer}
          </h2>
          <Typography variant="h1" color="text.secondary">
           {time}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
