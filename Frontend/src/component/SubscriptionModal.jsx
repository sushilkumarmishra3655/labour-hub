import React, { useState } from "react";
import { X, Check } from "lucide-react";
import api from "../services/api";
import Swal from "sweetalert2";
import "./SubscriptionModal.css";

const SUBSCRIPTION_PLANS = [
  {
    id: "Basic",
    name: "Basic Plan",
    price: 299,
    duration: "1 Month",
    features: [
      "Access to standard jobs",
      "Up to 20 applications/month",
      "Basic support",
      "Standard profile visibility"
    ],
    bg: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)"
  },
  {
    id: "Standard",
    name: "Standard Plan",
    price: 799,
    duration: "3 Months",
    features: [
      "Priority job access",
      "Up to 50 applications/month",
      "Priority customer support",
      "Enhanced profile visibility",
      "Direct employer messaging"
    ],
    bg: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
    popular: true
  },
  {
    id: "Premium",
    name: "Premium Plan",
    price: 2499,
    duration: "1 Year",
    features: [
      "All features included",
      "Unlimited applications",
      "24/7 Premium support",
      "Premium profile badge",
      "Top placement in searches",
      "Personalized job matching"
    ],
    bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
  }
];

const SubscriptionModal = ({ isOpen, onClose, user, onSubscriptionSuccess }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async (plan) => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const { data: order } = await api.post("/subscription/create-order", { planName: plan.id });

      // --- HANDLE DEMO MODE ---
      if (order.demo) {
          Swal.fire({
            title: "Demo Mode Active",
            text: "No real keys found. Simulating successful payment...",
            icon: "info",
            timer: 2000,
            showConfirmButton: false
          });
          
          setTimeout(async () => {
            try {
              const verifyRes = await api.post("/subscription/verify-payment", {
                razorpay_order_id: order.id,
                razorpay_payment_id: "pay_demo_" + Date.now(),
                razorpay_signature: "demo_signature",
                planName: plan.id
              });

              if (verifyRes.data.success) {
                Swal.fire("Success!", "Demo Subscription Active!", "success");
                onSubscriptionSuccess();
                onClose();
              }
            } catch (err) {
              console.error("Demo verification failed", err);
            }
          }, 2000);
          return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder", // Enter the Key ID generated from the Dashboard
        amount: order.amount,
        currency: order.currency,
        name: "Labour Hub",
        description: `${plan.name} Subscription`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // 2. Verify payment on backend
            const verifyRes = await api.post("/subscription/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planName: plan.id
            });

            if (verifyRes.data.success) {
              Swal.fire({
                title: "Success!",
                text: "Your subscription is now active.",
                icon: "success",
                confirmButtonColor: "#1E656D"
              });
              onSubscriptionSuccess();
              onClose();
            }
          } catch (err) {
            console.error("Verification failed", err);
            Swal.fire("Error", "Payment verification failed", "error");
          }
        },
        prefill: {
          name: user?.name,
          contact: user?.phone
        },
        theme: {
          color: "#1E656D"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Order creation failed", error);
      Swal.fire("Error", "Could not initiate payment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sub-modal-overlay" onClick={onClose}>
      <div className="sub-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="sub-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="sub-modal-header">
          <h2>Upgrade to Premium</h2>
          <p>Choose a plan that fits your needs and unlock all features.</p>
        </div>

        <div className="plans-grid">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <div className="plan-header" style={{ background: plan.bg }}>
                <h3>{plan.name}</h3>
                <div className="price-tag">
                  <span className="currency">₹</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/ {plan.duration}</span>
                </div>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <Check size={16} className="check-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                className="buy-btn" 
                onClick={() => handlePayment(plan)}
                disabled={loading}
              >
                {loading ? "Processing..." : "Get Started Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
