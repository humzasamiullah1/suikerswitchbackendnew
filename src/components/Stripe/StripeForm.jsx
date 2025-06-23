import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

// import Loader from "../Components/Loader/Loader";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ParentComponent from "../ParentComponent/ParentComponent";
import emailjs from "emailjs-com";
// import PrimaryHeader from "../Components/PrimaryHeader/PrimaryHeader";
import { toast } from "react-toastify";
import { useStateValue } from "../../context/StateProvider";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { saveuserdata } from "../utils/firebasefunctions";
import ImageTag from "../../components/reuseable/imageTag";
import { actionType } from "../../context/reducer";
import LabelTag from "../reuseable/label";
// App.jsx
const StripeForm = () => {
  const [{ loginData }, dispatch] = useStateValue();
  const [searchParams] = useSearchParams();
  const [clientSecret, setClientSecret] = useState("");
  const [clientdata, setclientdata] = useState("");
  const [email, setemail] = useState("");
  const [validemail, setvalidemail] = useState(false);
  const [username, setusername] = useState("");
  const [errormessage, seterrormessage] = useState("");
  // const email = searchParams.get("email");
  const subscriptiontypeindex = searchParams.get("type");
  // const username = email.substring(0, email.indexOf("@"));
  const [subscriptiondata, setsubscriptiondata] = useState([
    {
      type: "Monthly",
      title: "Month",
      description: "€ 9.99",
      value: 999,
      weekly: "€ 2.49 / week",
      info: "Billed monthly",
      currency: "eur",
      bestseller: false,
      selected: false,
      productid: "price_1RI93kAdN8nseiVboq99rVov",
    },
    {
      type: "Annual",
      title: "Year",
      bestseller: true,
      info: "Billed annually",
      description: "€ 79.99",
      value: 7999,
      weekly: "€ 1.67 / week",
      currency: "eur",
      selected: true,
      productid: "price_1RI94BAdN8nseiVbY31wyDgD",
    },
  ]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (email.includes("@") && isValidEmail(email)) {
        setusername(email.substring(0, email.indexOf("@")));
        fetchPaymentIntent(email.substring(0, email.indexOf("@")));
        seterrormessage("");
        setvalidemail(true);
      } else {
        if (email != "") {
          seterrormessage("Invalid Email");
        }

        setvalidemail(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [email]);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // fetch clientSecret when app loads
  const fetchPaymentIntent = async (username) => {
    const res = await fetch(
      `https://us-central1-suiker-switch.cloudfunctions.net/api/payment-intent/v2`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: subscriptiondata[subscriptiontypeindex || 0].value,
          currency: subscriptiondata[subscriptiontypeindex || 0].currency,
          email: email,
          name: username,
          priceId: subscriptiondata[subscriptiontypeindex || 0].productid,
          // amount: 9.99,
          // currency: 'gbp',
          // email: 'cs1712148@szabist.pk',
          // name: 'humzasamiullah',
        }),
      }
    );

    const { paymentIntent, ephemeralKey, customer } = await res.json();
    console.log("paymentIntent " + JSON.stringify(paymentIntent));
    console.log("ephemeralKey " + JSON.stringify(ephemeralKey));
    console.log("customer " + JSON.stringify(customer));
    setClientSecret(paymentIntent);
    setclientdata(customer);
  };

  const stripePromise = loadStripe(
    "pk_test_51NfVkoAdN8nseiVbFQG16E8QRBvJxD2ZMHPcdpYEmVOAeOkiYYk8yeVIqXk8M3jjlXCiB34jiPSI9ZTKLi76n5VW00sSVl4Phs"
  );

  return (
    <ParentComponent>
      <div className="flex w-full items-center justify-center py-[50px]">
        <ImageTag
          path="/assets/images/logo.png"
          classes="w-[80%] h-16 md:w-[30%] md:h-20 object-contain"
          altText="logo"
        />
      </div>
      <h2 className="text-md font-medium flex">
        Subscription Type: {subscriptiondata[subscriptiontypeindex || 0].type}
      </h2>
      <h2 className="text-md font-medium mb-10">
        Amount: $ {subscriptiondata[subscriptiontypeindex || 0].value / 100}
      </h2>
      <LabelTag name="Email" classes="text-md font-medium w-full " />
      <p class="text-sm w-full text-[12px] text-red-500">{errormessage}</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setemail(e.target.value)}
        required
        placeholder="Email (required)"
        className="w-full mb-3 mt-1 text-sm font-popinsRegular rounded-md bg-white px-3 py-2 text-darkColor"
      />

      {validemail && (
        <>
          {!clientSecret ? (
            <div className="mt-20">
              <div className="mr-[90px]">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-6 h-6 text-gray-200 animate-spin dark:text-white fill-gkRedColor"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                amount={subscriptiondata[subscriptiontypeindex || 0].value}
                type={subscriptiondata[subscriptiontypeindex || 0].type}
                priceId={subscriptiondata[subscriptiontypeindex || 0].productid}
                clientSecret={clientSecret}
                clientdata={clientdata}
                email={email}
                username={username}
              />
            </Elements>
          )}
        </>
      )}
    </ParentComponent>
  );
};
const CheckoutForm = (props) => {
  const [{ role, supportData, loginData, subLoader, Privilages }, dispatch] =
    useStateValue();
  const auth = getAuth();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setloading] = useState(false);
  const [username, setusername] = useState(props.username || "");
  const [email, setemail] = useState(props.email || "");

  useEffect(() => {
    const saved = localStorage.getItem("stripeform");
    if (saved) {
      const { name, email, path } = JSON.parse(saved);
      if (path != null && name != null && email != null) {
        setusername(name);
        setemail(email);
        dispatch({ type: actionType.SET_STRIPEFORM, payload: { name, email } });

        navigate(path, { replace: true });
      }
    }
  }, []);

  const createsubscription = async (customerid, productid, username, email) => {
    try {
      console.log(customerid + "customerid");

      // const res = await fetch(`http://localhost:3003/create-subscription`, {
      const res = await fetch(
        `https://us-central1-suiker-switch.cloudfunctions.net/api/create-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerid: customerid,
            productid: productid,
          }),
        }
      );

      let data = await res.json();

      console.log("data " + JSON.stringify(data));
      toast.success("Success! Your payment is confirmed!");
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      let password = "";

      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }

      updateuserdata(
        data.subscriptionbillingmethod,
        data.subscriptioncreationdate,
        data.subscriptioncustomerid,
        data.subscriptionid,
        data.subscriptionexpirydate,
        email,
        username,
        password
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("Payment Error!");

      setloading(false);
    }
  };

  const updateuserdata = async (
    subscriptionbillingmethod,
    subscriptioncreationdate,
    subscriptioncustomerid,
    subscriptionid,
    subscriptionexpirydate,
    email,
    username,
    password
  ) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Profile picture as empty string
        let data = {
          id: user?.uid,
          username: username,
          email: email,
          profilepicture: "",
          usertype: "Client",
          dob: "",
          subscriptiontype: subscriptionbillingmethod,
          subscriptiondate: Date.now(),
          customer: subscriptioncustomerid,
          subscriptionid: subscriptionid,
          subscriptionexpirydate: subscriptionexpirydate,
          subscriptioncancellationdate: null,
        };

        await saveuserdata(data, user?.uid).then(async (response) => {
          console.log("User data response: ", response);
          if (response === "success") {
            toast.success("Sign Up Successful");
            const templateParams = {
              email: email,
              message: `username: ${username} password: ${password}`,
            };

            emailjs
              .send(
                "service_5z77uef", // Replace with your Service ID
                "template_felqroq", // Replace with your Template ID
                templateParams,
                "reWowgm4fTZaLSeML" // Replace with your User ID
              )
              .then((response) => {
                console.log("SUCCESS!", response.status, response.text);
              })
              .catch((err) => {
                console.error("FAILED...", err);
              });
            setloading(false);
            await signOut(auth);
            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else {
            toast.error(response);
            setloading(false);
          }
        });
      })
      .catch((error) => {
        toast.error(error.message);
        setloading(false);
      });
  };

  const handleSubmit = async (event) => {
    setloading(true);
    event.preventDefault();
    localStorage.setItem(
      "stripeform",
      JSON.stringify({
        username,
        email,
        path: window.location.pathname,
        clientdata: props.clientdata,
        priceId: props.priceId,
      })
    );
    if (!stripe || !elements) {
      setloading(false);
      return;
    }
    await elements.submit();
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/PaymentComplete",
        payment_method_data: {
          billing_details: { name: username, email: email },
        },
      },
      // payment_method: {
      //   billing_details: {
      //     name: "Customer Name",
      //     email: "customer@example.com",
      //   },

      // card: cardElement,
      // setup_future_usage: "off_session",

      clientSecret: props.clientSecret,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
      setloading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      createsubscription(props.clientdata, props.priceId, username, email);
    }
  };

  return (
    // <div className="h-screen  w-full flex flex-col items-center justify-center border border-green-300">

    <form onSubmit={handleSubmit}>
      <LabelTag name="Payment" classes="text-md font-medium  w-full " />
      <PaymentElement
        className="mt-1"
        options={{
          fields: { billingDetails: { name: "auto", email: "never" } },
        }}
      />

      <div className="flex justify-end mt-5">
        {loading ? (
          <div className="mr-[90px]">
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-6 h-6 text-gray-200 animate-spin dark:text-white fill-gkRedColor"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <button
            className="w-full md:w-[300px]  py-2 text-sm bg-gkRedColor text-white rounded-md font-semibold"
            type="submit"
            disabled={!stripe || !elements}
          >
            Pay Now
          </button>
        )}
      </div>

      {/* {errorMessage && <div>{errorMessage}</div>} */}
    </form>
  );
};
export default StripeForm;
