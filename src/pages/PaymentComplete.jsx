import { useStripe } from "@stripe/react-stripe-js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveuserdata } from "../components/utils/firebasefunctions";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";

export default function PaymentComplete() {
  const stripe = useStripe();
  const [message, setMessage] = useState("Verifying payment…");
  const [loading, setloading] = useState(false);
  const auth = getAuth();

  const navigate = useNavigate();
  //   useEffect(() => {
  //     const params = new URLSearchParams(window.location.search);
  //     const clientSecret = params.get("payment_intent_client_secret");
  //     if (!stripe || !clientSecret) return;

  //     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
  //       switch (paymentIntent.status) {
  //         case "succeeded":
  //           setMessage("✅ Payment succeeded!");
  //           break;
  //         case "processing":
  //           setMessage("⏳ Payment processing. You'll receive an update soon.");
  //           break;
  //         case "requires_payment_method":
  //           setMessage(
  //             '❌ Payment failed. Please <a href="/retry">try again</a>.'
  //           );
  //           break;
  //         default:
  //           setMessage("Something went wrong.");
  //       }
  //       localStorage.removeItem("bancontactForm");
  //     });
  //   }, [stripe]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientSecret = params.get("payment_intent_client_secret");
    if (!stripe || !clientSecret) return;

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("✅ Payment succeeded!");
            const saved = localStorage.getItem("stripeform");

            if (saved) {
              const { username, email, path, clientdata, priceId } =
                JSON.parse(saved);

              if (
                path != null &&
                username != null &&
                email != null &&
                clientdata != null &&
                priceId != null
              ) {
                setloading(true);
                createsubscription(clientdata, priceId, username, email);
              }
            }

            // setTimeout(() => {
            //   navigate("/dashboard");
            // }, 2000);

            break;
          case "processing":
            setMessage("⏳ Payment processing. You'll receive an update soon.");
            localStorage.removeItem("stripeform");
            break;
          case "requires_payment_method":
            setMessage(
              '❌ Payment failed. Please <a href="/retry">try again</a>.'
            );
            localStorage.removeItem("stripeform");
            break;
          default:
            setMessage("Something went wrong.");
        }
      })
      .catch((error) => {
        alert("this is error " + error);
      });
  }, [stripe]);

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
      toast.success("Success! Your Subscription was created Successfully!");
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
      setMessage(error.message);
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
            localStorage.removeItem("stripeform");
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
        setMessage(error.message);
        toast.error(error.message);
        setloading(false);
      });
  };

  return <div dangerouslySetInnerHTML={{ __html: message }} />;
}
