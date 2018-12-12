import TouchID from 'react-native-touch-id';

/**
 * Resolves to either 'FaceID' or 'TouchID'.
 */
const getSupportedBiometryType = () => {
  return TouchID.isSupported().catch(() => {
    // Suppress errors.
    return null;
  });
};

export default getSupportedBiometryType;
