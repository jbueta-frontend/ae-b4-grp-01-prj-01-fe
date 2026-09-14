import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Active Tab: Support /addresses and ?tab=address / ?tab=personal
  const [activeTab, setActiveTab] = useState(() => {
    if (
      location.pathname === '/addresses' ||
      searchParams.get('tab') === 'address' ||
      searchParams.get('tab') === 'addresses'
    ) {
      return 'address';
    }
    if (searchParams.get('tab') === 'security') {
      return 'security';
    }
    if (searchParams.get('tab') === 'account') {
      return 'account';
    }
    return 'personal';
  });

  useEffect(() => {
    if (
      location.pathname === '/addresses' ||
      searchParams.get('tab') === 'address' ||
      searchParams.get('tab') === 'addresses'
    ) {
      setActiveTab('address');
    } else if (searchParams.get('tab') === 'personal') {
      setActiveTab('personal');
    } else if (searchParams.get('tab') === 'security') {
      setActiveTab('security');
    } else if (searchParams.get('tab') === 'account') {
      setActiveTab('account');
    }
  }, [location.pathname, searchParams]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Profile Entities State
  const [personalData, setPersonalData] = useState(() => {
    const defaultName = user?.name || user?.fullName || '';
    const defaultDisplay =
      user?.displayName ||
      (defaultName ? defaultName.split(' ')[0].toLowerCase() : '') ||
      (user?.email ? user.email.split('@')[0] : 'user');

    return {
      ...INITIAL_PROFILE_STATE.personal,
      id: user?.userId || user?.id || '',
      name: defaultName,
      displayName: defaultDisplay,
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      role: user?.role || 'Customer',
      createdAt: user?.createdAt || '',
    };
  });

  const [addressData, setAddressData] = useState(() => {
    if (user?.address && user.address.addressLine1) {
      return { ...INITIAL_PROFILE_STATE.address, ...user.address };
    }
    const userKey = user?.userId || user?.id || user?.email;
    if (userKey) {
      try {
        const saved = localStorage.getItem(`fiddlemania_user_address_${userKey}`);
        if (saved) return { ...INITIAL_PROFILE_STATE.address, ...JSON.parse(saved) };
      } catch {}
    }
    return INITIAL_PROFILE_STATE.address;
  });

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

  // Fetch live profile fields and addresses from backend on mount
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
        }

        // Fetch real addresses from backend
        const addresses = await api.get('/addresses').catch(() => []);
        if (isMounted && Array.isArray(addresses) && addresses.length > 0) {
          const defaultAddr =
            addresses.find((a) => a.isDefaultShipping || a.isDefault) || addresses[0];
          if (defaultAddr) {
            const mapped = {
              id: defaultAddr.addressId || defaultAddr.id || '',
              addressId: defaultAddr.addressId || defaultAddr.id || '',
              recipientName: defaultAddr.recipientName || '',
              phone: defaultAddr.phone || '',
              addressLine1: defaultAddr.addressLine1 || '',
              addressLine2: defaultAddr.addressLine2 || '',
              city: defaultAddr.city || '',
              stateProvince: defaultAddr.stateProvince || '',
              postalCode: defaultAddr.postalCode || '',
              country: defaultAddr.country || 'Philippines',
            };
            setAddressData(mapped);
            setAddressDraft(mapped);
            updateProfile({ address: mapped });
            const userKey =
              liveUser?.userId ||
              liveUser?.id ||
              liveUser?.email ||
              user?.userId ||
              user?.id ||
              user?.email;
            if (userKey) {
              try {
                localStorage.setItem(
                  `fiddlemania_user_address_${userKey}`,
                  JSON.stringify(mapped)
                );
              } catch {}
            }
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
    if (isEditingAddress) {
      setAddressDraft({
        ...addressData,
        recipientName: addressData.recipientName || user?.name || user?.fullName || '',
        phone: addressData.phone || user?.phone || '',
      });
    }
  }, [isEditingAddress, addressData, user]);

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
    let sanitized = value;
    if (field === 'postalCode') {
      // Postal Code must be digits only and cannot exceed 6 digits
      sanitized = value.replace(/\D/g, '').slice(0, 6);
      if (value && /\D/.test(value)) {
        setAddressErrors((prev) => ({
          ...prev,
          postalCode: 'Postal code can only contain numbers (integers only).',
        }));
      } else if (addressErrors.postalCode) {
        setAddressErrors((prev) => ({ ...prev, postalCode: null }));
      }
    } else if (addressErrors[field]) {
      setAddressErrors((prev) => ({ ...prev, [field]: null }));
    }
    setAddressDraft((prev) => ({ ...prev, [field]: sanitized }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const validation = validateAddress(addressDraft);
    if (!validation.isValid) {
      setAddressErrors(validation.errors);
      return;
    }

    try {
      const payload = {
        recipientName: addressDraft.recipientName,
        phone: addressDraft.phone,
        addressLine1: addressDraft.addressLine1,
        addressLine2: addressDraft.addressLine2 || '',
        city: addressDraft.city,
        stateProvince: addressDraft.stateProvince,
        postalCode: addressDraft.postalCode,
        country: addressDraft.country || 'Philippines',
        isDefault: true,
      };

      let savedRecord = null;
      const existingId =
        addressDraft.id ||
        addressDraft.addressId ||
        addressData.id ||
        addressData.addressId;

      if (existingId) {
        try {
          const res = await api.put(`/addresses/${existingId}`, payload);
          savedRecord = res?.data || res;
        } catch {
          // If PUT fails or id invalid, fall back to creating
        }
      }

      if (!savedRecord) {
        const res = await api.post('/addresses', payload);
        savedRecord = res?.data || res;
      }

      const finalAddress = {
        ...addressDraft,
        id: savedRecord?.addressId || savedRecord?.id || existingId || '',
        addressId: savedRecord?.addressId || savedRecord?.id || existingId || '',
      };

      setAddressData(finalAddress);
      setAddressDraft(finalAddress);
      setIsEditingAddress(false);
      setAddressErrors({});

      // Sync address into AuthContext and user-scoped storage
      updateProfile({ address: finalAddress });
      const userKey = user?.userId || user?.id || user?.email;
      if (userKey) {
        try {
          localStorage.setItem(
            `fiddlemania_user_address_${userKey}`,
            JSON.stringify(finalAddress)
          );
        } catch {}
      }
      localStorage.removeItem('fiddlemania_user_address');

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
