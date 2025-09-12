import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopPlacesQuery } from "../slices/placesApiSlice";

const PlaceCarousel = () => {
  const { data: places, isLoading, error } = useGetTopPlacesQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-primary mb-4">
      {places.map((place) => (
        <Carousel.Item key={place._id}>
          <Link to={`/place/${place._id}`}>
            <Image src={place.image} alt={place.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2 className="text-white text-right">
                {place.name} (${place.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default PlaceCarousel;
