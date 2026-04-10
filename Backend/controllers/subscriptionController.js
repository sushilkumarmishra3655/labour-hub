const Razorpay = require("razorpay");
const crypto = require("crypto");
const Subscription = require("../models/Subscription");
const User = require("../models/User");

const PLANS = {
  Basic: { price: 299, durationDays: 30 },
  Standard: { price: 799, durationDays: 90 },
  Premium: { price: 2499, durationDays: 365 },
};

// @desc    Create Razorpay Order
// @route   POST /api/subscription/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { planName } = req.body;
    const plan = PLANS[planName];

    if (!plan) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // CHECK FOR MISSING KEYS - ENABLE DEMO MODE IF MISSING
    if (!key_id || !key_secret || key_id.includes("YOUR_KEY_HERE")) {
      console.log("Demo Mode: Generating mock order as Razorpay keys are missing.");
      return res.status(200).json({
        id: `order_demo_${Date.now()}`,
        amount: plan.price * 100,
        currency: "INR",
        demo: true
      });
    }

    const instance = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const options = {
      amount: plan.price * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Error creating Razorpay order" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Verify Payment and Create Subscription
// @route   POST /api/subscription/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      planName 
    } = req.body;

    // HANDLE DEMO MODE VERIFICATION
    if (razorpay_order_id?.startsWith("order_demo_")) {
      console.log("Demo Mode: Bypassing signature verification.");
      return await createSubscriptionRecord(req, res, razorpay_order_id, "pay_demo_" + Date.now(), planName);
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "placeholder_secret")
      .update(body.toString())
      .digest("hex");

    const isMatch = expectedSignature === razorpay_signature;

    if (isMatch) {
      return await createSubscriptionRecord(req, res, razorpay_order_id, razorpay_payment_id, planName);
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// HELPER FUNCTION TO CREATE SUBSCRIPTION
const createSubscriptionRecord = async (req, res, orderId, paymentId, planName) => {
  const plan = PLANS[planName];
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

  await Subscription.updateMany(
    { userId: req.user.id, status: "Active" },
    { status: "Expired" }
  );

  const newSubscription = await Subscription.create({
    userId: req.user.id,
    planName,
    price: plan.price,
    expiryDate,
    status: "Active",
    paymentId: paymentId,
    orderId: orderId,
  });

  await User.findByIdAndUpdate(req.user.id, { isPremium: true });

  return res.status(200).json({
    success: true,
    message: "Subscription activated successfully",
    subscription: newSubscription,
  });
};

// @desc    Get current user subscription
// @route   GET /api/subscription/my-subscription
// @access  Private
const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: "Active",
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(200).json(null);
    }

    // Check if expired
    if (new Date() > new Date(subscription.expiryDate)) {
      subscription.status = "Expired";
      await subscription.save();
      await User.findByIdAndUpdate(req.user._id, { isPremium: false });
      return res.status(200).json(null);
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error("Get Subscription Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMySubscription,
};
