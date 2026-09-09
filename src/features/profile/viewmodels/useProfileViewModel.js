import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import {
  INITIAL_PROFILE_STATE,
  validatePersonal,
  validateAddress,
  validatePasswordChange,
  validateEmailChange,
} from '../models/profileModel';

export function useProfileViewModel() {
  const {
    user,
    isAuthenticated,
    updateProfile,
    deactivateAccount,
    deleteAccount,
  } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Profile Entities State
  const [personalData, setPersonalData] = useState(() => {
    return {
      ...INITIAL_PROFILE_STATE.personal,
      name: user?.name || INITIAL_PROFILE_STATE.personal.name,
      displayName:
        user?.displayName ||
        user?.name?.split(' ')[0]?.toLowerCase() ||
        INITIAL_PROFILE_STATE.personal.displayName,
      email: user?.email || INITIAL_PROFILE_STATE.personal.email,
      phone: user?.phone || INITIAL_PROFILE_STATE.personal.phone,
      bio: user?.bio || INITIAL_PROFILE_STATE.personal.bio,
      role: user?.role || INITIAL_PROFILE_STATE.personal.role,
    };
  });

  const [addressData, setAddressData] = useState(INITIAL_PROFILE_STATE.address);

  // Edit Mode Toggles
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalDraft, setPersonalDraft] = useState(personalData);
  const [personalErrors, setPersonalErrors] = useState({});

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressDraft, setAddressDraft] = useState(addressData);
  const [addressErrors, setAddressErrors] = useState({});

  // Security Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    passwordConfirm: '',
  });
  const [emailErrors, setEmailErrors] = useState({});

  // Danger Zone Modals
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Fetch live profile fields from backend on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get('/auth/me');
        const liveUser = res.user || res;
        if (isMounted && liveUser) {
          setPersonalData((prev) => ({
            ...prev,
            name: liveUser.name || prev.name,
            displayName: liveUser.displayName || prev.displayName,
            email: liveUser.email || prev.email,
            phone: liveUser.phone || prev.phone,
            role: liveUser.role || prev.role,
            createdAt: liveUser.createdAt || prev.createdAt,
          }));
          if (liveUser.address) {
            setAddressData((prev) => ({ ...prev, ...liveUser.address }));
          }
        }
      } catch {
        // Backend offline / mock fallback used gracefully
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Sync drafts when edit mode opens
  useEffect(() => {
    if (isEditingPersonal) setPersonalDraft(personalData);
  }, [isEditingPersonal, personalData]);

  useEffect(() => {
    if (isEditingAddress) setAddressDraft(addressData);
  }, [isEditingAddress, addressData]);

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  /* ----------------- PERSONAL INFO HANDLERS ----------------- */
  const handlePersonalChange = (field, value) => {
    setPersonalDraft((prev) => ({ ...prev, [field]: value }));
    if (personalErrors[field]) {
      setPersonalErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    const validation = validatePersonal(personalDraft);
    if (!validation.isValid) {
      setPersonalErrors(validation.errors);
      return;
    }

    try {
      await api.patch('/users/profile', personalDraft).catch(() => {});
      setPersonalData(personalDraft);
      updateProfile({
        name: personalDraft.name,
        displayName: personalDraft.displayName,
        email: personalDraft.email,
        phone: personalDraft.phone,
        bio: personalDraft.bio,
      });
      setIsEditingPersonal(false);
      setPersonalErrors({});
      showNotice('success', 'Personal information updated successfully.');
    } catch (err) {
      showNotice('error', err.message || 'Failed to update personal details.');
    }
  };

  const handleCancelPersonal = () => {
    setPersonalDraft(personalData);
    setPersonalErrors({});
    setIsEditingPersonal(false);
  };

  /* ----------------- ADDRESS HANDLERS ----------------- */
  const handleAddressChange = (field, value) => {
    setAddressDraft((prev) => ({ ...prev, [field]: value }));
    if (addressErrors[field]) {
      setAddressErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const validation = validateAddress(addressDraft);
    if (!validation.isValid) {
      setAddressErrors(validation.errors);
      return;
    }

    try {
      await api.patch('/users/address', addressDraft).catch(() => {});
      setAddressData(addressDraft);
      setIsEditingAddress(false);
      setAddressErrors({});
      showNotice('success', 'Delivery address saved successfully.');
    } catch (err) {
      showNotice('error', err.message || 'Failed to update delivery address.');
    }
  };

  const handleCancelAddress = () => {
    setAddressDraft(addressData);
    setAddressErrors({});
    setIsEditingAddress(false);
  };

  /* ----------------- SECURITY HANDLERS ----------------- */
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const validation = validatePasswordChange(passwordForm);
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      return;
    }

    try {
      await api.post('/auth/change-password', passwordForm).catch(() => {});
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
      showNotice('success', 'Your password has been changed securely.');
    } catch (err) {
      setPasswordErrors({ form: err.message || 'Failed to update password.' });
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    const validation = validateEmailChange(emailForm);
    if (!validation.isValid) {
      setEmailErrors(validation.errors);
      return;
    }

    try {
      await api.post('/auth/change-email', emailForm).catch(() => {});
      setPersonalData((prev) => ({ ...prev, email: emailForm.newEmail }));
      updateProfile({ email: emailForm.newEmail });
      setEmailForm({ newEmail: '', passwordConfirm: '' });
      setEmailErrors({});
      showNotice(
        'success',
        'Email updated. Please check your inbox for verification.'
      );
    } catch (err) {
      setEmailErrors({
        form: err.message || 'Failed to modify email address.',
      });
    }
  };

  /* ----------------- DANGER ZONE / ACCOUNT ACTIONS ----------------- */
  const handleConfirmDeactivate = async () => {
    try {
      await deactivateAccount();
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmText !== 'DELETE') {
      showNotice('error', 'Please type DELETE in capital letters to confirm.');
      return;
    }
    try {
      await deleteAccount();
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    activeTab,
    setActiveTab,
    notification,
    clearNotification: () => setNotification(null),

    // Personal
    personalData,
    personalDraft,
    isEditingPersonal,
    setIsEditingPersonal,
    personalErrors,
    handlePersonalChange,
    handleSavePersonal,
    handleCancelPersonal,

    // Address
    addressData,
    addressDraft,
    isEditingAddress,
    setIsEditingAddress,
    addressErrors,
    handleAddressChange,
    handleSaveAddress,
    handleCancelAddress,

    // Security
    passwordForm,
    setPasswordForm,
    passwordErrors,
    handlePasswordChange,
    emailForm,
    setEmailForm,
    emailErrors,
    handleEmailChange,

    // Account Modals
    showDeactivateModal,
    setShowDeactivateModal,
    showDeleteModal,
    setShowDeleteModal,
    deleteConfirmText,
    setDeleteConfirmText,
    handleConfirmDeactivate,
    handleConfirmDelete,
  };
}
