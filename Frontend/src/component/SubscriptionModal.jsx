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
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[1]); // Default to Standard
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || ""
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      Swal.fire("Required", "Please fill Name and Phone number", "warning");
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on backend
      const { data: order } = await api.post("/subscription/create-order", { planName: selectedPlan.id });

      // --- HANDLE DEMO MODE ---
      if (order.demo) {
          Swal.fire({
            title: "Simulated Payment",
            text: "Setting up your premium features...",
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
                planName: selectedPlan.id
              });

              if (verifyRes.data.success) {
                Swal.fire("Success!", "Premium Subscription Active!", "success");
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
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: "Labour Hub",
        description: `${selectedPlan.name} Subscription`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // 2. Verify payment on backend
            const verifyRes = await api.post("/subscription/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planName: selectedPlan.id
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
          name: formData.name,
          contact: formData.phone,
          email: formData.email
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
      <div className="sub-modal-container compact" onClick={(e) => e.stopPropagation()}>
        <button className="sub-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="sub-modal-header compact">
          <h2>Upgrade to Premium</h2>
          <p>Get unlimited access and premium features.</p>
        </div>

        <div className="plans-grid-compact">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div 
              key={plan.id} 
              className={`plan-card-mini ${selectedPlan.id === plan.id ? 'active' : ''}`}
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="plan-name-v3">{plan.name}</div>
              <div className="plan-price-v3">₹{plan.price}</div>
              <div className="plan-dur-v3">{plan.duration}</div>
              {selectedPlan.id === plan.id && <Check className="selected-icon" size={16} />}
            </div>
          ))}
        </div>

        <form className="billing-form-compact" onSubmit={handlePayment}>
          <div className="form-group-compact">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="Your Name"
              required
            />
          </div>

          <div className="form-row-compact">
            <div className="form-group-compact">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange} 
                placeholder="Phone Number"
                required
              />
            </div>
            <div className="form-group-compact">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="Email (Optional)"
              />
            </div>
          </div>

          <div className="billing-summary-compact">
             <p>Final Price: <strong>₹{selectedPlan.price}</strong> <span>({selectedPlan.duration})</span></p>
          </div>

          <button type="submit" className="pay-btn-compact" disabled={loading}>
            {loading ? "Processing..." : `Subscribe to ${selectedPlan.name}`}
          </button>
        </form>
      </div>
    </div>
  );
};


export default SubscriptionModal;
