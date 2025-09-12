import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useDeliverBookingMutation,
  useGetBookingDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayBookingMutation,
} from "../slices/bookingsApiSlice";

const BookingScreen = () => {
  const { id: bookingId } = useParams();

  const {
    data: booking,
    refetch,
    isLoading,
    error,
  } = useGetBookingDetailsQuery(bookingId);

  const [payBooking, { isLoading: loadingPay }] = usePayBookingMutation();

  const [deliverBooking, { isLoading: loadingDeliver }] =
    useDeliverBookingMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (booking && !booking.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, booking, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.booking.capture().then(async function (details) {
      try {
        await payBooking({ bookingId, details });
        refetch();
        toast.success("Booking is paid");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  async function onApproveTest() {
    await payBooking({ bookingId, details: { payer: {} } });
    refetch();

    toast.success("Booking is paid");
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createBooking(data, actions) {
    return actions.booking
      .create({
        purchase_units: [
          {
            amount: { value: booking.totalPrice },
          },
        ],
      })
      .then((bookingID) => {
        return bookingID;
      });
  }

  const deliverHandler = async () => {
    await deliverBooking(bookingId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Booking {booking._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {booking.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${booking.user.email}`}>
                  {booking.user.email}
                </a>
              </p>
              <p>
                <strong>Address:</strong>
                {booking.shippingAddress.address},{" "}
                {booking.shippingAddress.city}{" "}
                {booking.shippingAddress.postalCode},{" "}
                {booking.shippingAddress.country}
              </p>
              {booking.isDelivered ? (
                <Message variant="success">
                  Delivered on {booking.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {booking.paymentMethod}
              </p>
              {booking.isPaid ? (
                <Message variant="success">Paid on {booking.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Booking Items</h2>
              {booking.bookingItems.length === 0 ? (
                <Message>Booking is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {booking.bookingItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/place/${item.place}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Booking Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${booking.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${booking.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${booking.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${booking.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!booking.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <Button
                        style={{ marginBottom: "10px" }}
                        onClick={onApproveTest}
                      >
                        Test Pay Booking
                      </Button>

                      <div>
                        <PayPalButtons
                          createBooking={createBooking}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                booking.isPaid &&
                !booking.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BookingScreen;
