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
      // toast.success("Success! Your Subscription was created Successfully!");
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
            // toast.success("Sign Up Successful");
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
              window.location.href = "https://suikerswitch.nl/bedankt/";
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

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
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
      <p class="text-[14px] mt-[10px]">Processing secure payment...</p>
    </div>
  );

  // <div dangerouslySetInnerHTML={{ __html: message }} />;
}
