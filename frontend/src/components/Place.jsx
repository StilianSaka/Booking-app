import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Place = ({ place }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/place/${place._id}`}>
        <Card.Img src={place.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/place/${place._id}`}>
          <Card.Title as="div" className="place-title">
            <strong>{place.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating value={place.rating} text={`${place.numReviews} reviews`} />
        </Card.Text>

        <Card.Text as="h3">${place.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Place;
