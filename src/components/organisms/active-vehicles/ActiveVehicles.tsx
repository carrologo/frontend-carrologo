import Grid from "@mui/material/Grid";
import "./ActiveVehicles.css";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

const ActiveVehicles = () => {
  return (
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 20 }}>
                <Grid size={4}>
                    <Card>
                        <CardHeader
                            title="Modelo"
                            subheader="Año"
                        />
                        <CardMedia
                            component="img"
                            height="194"
                            image="/images/mercedes.jpg"
                            alt="Vehiculo"
                        />
                        <CardContent>
                            <p>Placa: </p>
                            <p>Ciudad de matricula: </p>
                            <p>Precio: </p>
                            <p>Serie: </p>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Ver detalles</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Card>
                        <CardHeader
                            title="Modelo"
                            subheader="Año"
                        />
                        <CardMedia
                            component="img"
                            height="194"
                            image="/images/mercedes.jpg"
                            alt="Vehiculo"
                        />
                        <CardContent>
                            <p>Placa: </p>
                            <p>Ciudad de matricula: </p>
                            <p>Precio: </p>
                            <p>Serie: </p>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Ver detalles</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Card>
                        <CardHeader
                            title="Modelo"
                            subheader="Año"
                        />
                        <CardMedia
                            component="img"
                            height="194"
                            image="/images/mercedes.jpg"
                            alt="Vehiculo"
                        />
                        <CardContent>
                            <p>Placa: </p>
                            <p>Ciudad de matricula: </p>
                            <p>Precio: </p>
                            <p>Serie: </p>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Ver detalles</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Card>
                        <CardHeader
                            title="Modelo"
                            subheader="Año"
                        />
                        <CardMedia
                            component="img"
                            height="194"
                            image="/images/mercedes.jpg"
                            alt="Vehiculo"
                        />
                        <CardContent>
                            <p>Placa: </p>
                            <p>Ciudad de matricula: </p>
                            <p>Precio: </p>
                            <p>Serie: </p>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Ver detalles</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid size={4}>
                    <Card>
                        <CardHeader
                            title="Modelo"
                            subheader="Año"
                        />
                        <CardMedia
                            component="img"
                            height="194"
                            image="/images/mercedes.jpg"
                            alt="Vehiculo"
                        />
                        <CardContent>
                            <p>Placa: </p>
                            <p>Ciudad de matricula: </p>
                            <p>Precio: </p>
                            <p>Serie: </p>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Ver detalles</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

);
}

export default ActiveVehicles;