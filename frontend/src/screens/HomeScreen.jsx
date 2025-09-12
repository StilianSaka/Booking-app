import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetPlacesQuery } from "../slices/placesApiSlice";
import { Link } from "react-router-dom";
import Place from "../components/Place";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import PlaceCarousel from "../components/PlaceCarousel";
import Meta from "../components/Meta";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetPlacesQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword ? (
        <PlaceCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h1>Latest Places</h1>
          <Row>
            {data.places.map((place) => (
              <Col key={place._id} sm={12} md={6} lg={4} xl={3}>
                <Place place={place} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
