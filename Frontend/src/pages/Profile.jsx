import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  User, Mail, Phone, MapPin, Building, Calendar, 
  Edit3, Save, X, Navigation, Loader, Briefcase, Award, Info, Camera
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import useCurrentLocation from "../hooks/useCurrentLocation";
import SubscriptionModal from "../component/SubscriptionModal";
import { CreditCard, Crown, Sparkles } from "lucide-react";
import "./Profile.css";

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subLoading, setSubLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    companyName: "",
    gender: "",
    dob: "",
    skills: "",
    experience: "",
    profileImage: "",
  });

  const { fetchLocation, locLoading, locError } = useCurrentLocation();

  const handleUseCurrentLocation = () => {
    fetchLocation((address) => {
      setFormData(prev => ({ ...prev, location: address }));
    });
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        companyName: user.companyName || "",
        gender: user.gender || "",
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
        skills: user.skills ? user.skills.join(", ") : "",
        experience: user.experience || "",
        profileImage: user.profileImage || ""
      });
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      setSubLoading(true);
      const res = await api.get("/subscription/my-subscription");
      setSubscription(res.data);
      
      // If subscription is now active, refresh global user state to show Crown etc.
      if (res.data?.status === "Active") {
          const userRes = await api.get("/users/profile");
          login({ user: userRes.data, token: localStorage.getItem("token") });
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
    } finally {
      setSubLoading(false);
    }
  };

  if (!user) return <div className="profile-loading">Loading Profile...</div>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Split skills if provided
      const skillsArray = formData.skills 
        ? formData.skills.split(",").map(s => s.trim()).filter(s => s) 
        : [];
        
      const payload = {
        ...formData,
        skills: skillsArray
      };

      if (payload.dob === "") {
        payload.dob = null;
      }

      const res = await api.put("/users/update-profile", payload);
      if (res.data.success) {
        const updatedUser = { ...user, ...res.data.user };
        login({ user: updatedUser, token: localStorage.getItem("token") });
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      companyName: user.companyName || "",
      gender: user.gender || "",
      dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
      skills: user.skills ? user.skills.join(", ") : "",
      experience: user.experience || "",
      profileImage: user.profileImage || ""
    });
    setIsEditing(false);
  };

  const isWorker = user.role === "worker";
  const isEmployer = user.role === "employer";

  return (
    <div className="profile-dashboard-wrapper">
      <div className="profile-header-bar">
        <div>
          <h1 className="page-heading">My Profile</h1>
          <p className="page-subheading">Manage your personal and professional identity.</p>
        </div>
        <div className="header-actions">
          {!isEditing ? (
            <button className="btn-edit-premium" onClick={() => setIsEditing(true)}>
              <Edit3 size={16} /> Update Details
            </button>
          ) : (
            <div className="action-row">
              <button className="btn-cancel-premium" onClick={handleCancel} disabled={loading}>
                <X size={16} /> Discard
              </button>
              <button className="btn-save-premium" onClick={handleSave} disabled={loading}>
                {loading ? <Loader size={16} className="spin-icon" /> : <Save size={16} />} 
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-grid">
        {/* LEFT COLUMN: Identity Showcase */}
        <aside className="profile-sidebar">
          <div className="identity-card">
            <div className="avatar-large" style={{ position: 'relative' }}>
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="avatar-img-view" />
              ) : (
                formData.name ? formData.name.charAt(0).toUpperCase() : "U"
              )}
              
              {isEditing && (
                <>
                  <label htmlFor="profilePhotoUpload" className="avatar-upload-overlay">
                    <Camera size={20} color="white" />
                  </label>
                  <input 
                    type="file" 
                    id="profilePhotoUpload" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleImageChange}
                  />
                </>
              )}
            </div>
            <h2 className="identity-name">{formData.name || "Unknown User"}</h2>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
              <span className={`role-badge ${user.role}`}>{user.role}</span>
              {user.isPremium && (
                <span className="premium-badge-tag">
                  <Crown size={12} fill="currentColor" /> Premium
                </span>
              )}
            </div>
            <div className="identity-meta">
              <span>Member since {new Date(user.createdAt || Date.now()).getFullYear()}</span>
            </div>
          </div>

          <div className="subscription-card-mini">
             <div className="s-header">
                <Sparkles size={16} color="#f59e0b" />
                <h4>My Subscription</h4>
             </div>
             {subLoading ? (
               <div className="sub-skeleton"></div>
             ) : subscription ? (
               <div className="active-sub-info">
                  <p className="plan-name">{subscription.planName} Plan</p>
                  <p className="expiry">Expires: {new Date(subscription.expiryDate).toLocaleDateString()}</p>
                  <span className={`status-pill ${subscription.status.toLowerCase()}`}>{subscription.status}</span>
               </div>
             ) : (
               <div className="no-sub-info">
                  <p>No Active Plan</p>
                  <button className="btn-get-sub" onClick={() => setSubModalOpen(true)}>
                    Upgrade Now
                  </button>
               </div>
             )}
             {subscription && (
               <button className="btn-upgrade-mini" onClick={() => setSubModalOpen(true)}>
                 Manage Plan
               </button>
             )}
          </div>

          <div className="completion-card">
             <div className="c-header">
                <Info size={16} color="var(--primary-blue)" />
                <h4>Profile Status</h4>
             </div>
             <p className="c-desc">Complete your profile to increase your visibility on the platform.</p>
             <div className="progress-track">
                <div className="progress-fill" style={{ width: '85%' }}></div>
             </div>
             <span className="c-percent">85% Completed</span>
          </div>
        </aside>

        {/* RIGHT COLUMN: Edit Forms */}
        <div className="profile-content">
          
          <div className="content-section">
            <div className="section-title">
              <User size={18} />
              <h3>Personal Information</h3>
            </div>
            <div className="form-grid-2">
              <div className="f-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="i-icon" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
                </div>
              </div>

              <div className="f-group">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={16} className="i-icon" />
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
                </div>
              </div>

              <div className="f-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="i-icon" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} placeholder="Not provided" />
                </div>
              </div>

              <div className="f-group">
                <label>Date of Birth</label>
                <div className="input-with-icon">
                  <Calendar size={16} className="i-icon" />
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={!isEditing} />
                </div>
              </div>

              <div className="f-group">
                <label>Gender</label>
                {!isEditing ? (
                  <input 
                    type="text" 
                    value={formData.gender || "N/A"} 
                    disabled 
                    className="basic-input" 
                  />
                ) : (
                  <select name="gender" value={formData.gender} onChange={handleChange} className="c-select">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="content-section">
            <div className="section-title">
              <Briefcase size={18} />
              <h3>Professional Details</h3>
            </div>
            
            <div className="form-grid-2">
              <div className="f-group location-group" style={{ gridColumn: '1 / -1' }}>
                <label>Primary Location</label>
                <div className="loc-input-row" style={{ display: 'flex', gap: '10px' }}>
                  <div className="input-with-icon" style={{ flex: 1 }}>
                    <MapPin size={16} className="i-icon" />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Mumbai, Maharashtra" />
                  </div>
                  {isEditing && (
                    <button type="button" className="btn-use-loc" onClick={handleUseCurrentLocation} disabled={locLoading}>
                      {locLoading ? <Loader size={16} className="spin-icon" /> : <Navigation size={16} />}
                      Detect
                    </button>
                  )}
                </div>
                {locError && isEditing && <span className="error-micro">{locError}</span>}
              </div>

              {isWorker && (
                <>
                  <div className="f-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Key Skills (comma separated)</label>
                    <div className="input-with-icon">
                      <Award size={16} className="i-icon" />
                      <input type="text" name="skills" value={formData.skills} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Masonry, Plumbing, Electrical" />
                    </div>
                  </div>
                  <div className="f-group">
                    <label>Years of Experience</label>
                    <input type="text" name="experience" value={formData.experience} onChange={handleChange} disabled={!isEditing} placeholder="e.g. 5 Years" className="basic-input" />
                  </div>
                </>
              )}

              {isEmployer && (
                <div className="f-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Company / Business Name</label>
                  <div className="input-with-icon">
                    <Building size={16} className="i-icon" />
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Skyline Builders Corp" />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <SubscriptionModal 
        isOpen={subModalOpen} 
        onClose={() => setSubModalOpen(false)} 
        user={user}
        onSubscriptionSuccess={fetchSubscription}
      />
    </div>
  );
};

export default Profile;
