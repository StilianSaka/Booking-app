import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import {
  useGetPlacesQuery,
  useDeletePlaceMutation,
  useCreatePlaceMutation,
} from "../../slices/placesApiSlice";
import { toast } from "react-toastify";

const PlaceListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetPlacesQuery({
    pageNumber,
  });

  const [deletePlace, { isLoading: loadingDelete }] = useDeletePlaceMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deletePlace(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createPlace, { isLoading: loadingCreate }] = useCreatePlaceMutation();

  const createPlaceHandler = async () => {
    if (window.confirm("Are you sure you want to create a new place?")) {
      try {
        await createPlace();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Places</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createPlaceHandler}>
            <FaPlus /> Create Place
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.places.map((place) => (
                <tr key={place._id}>
                  <td>{place._id}</td>
                  <td>{place.name}</td>
                  <td>${place.price}</td>
                  <td>{place.category}</td>
                  <td>{place.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/place/${place._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(place._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default PlaceListScreen;
