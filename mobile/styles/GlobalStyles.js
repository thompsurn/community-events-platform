import { StyleSheet } from 'react-native';
import Theme from './Theme';

const GlobalStyles = StyleSheet.create({
  // General
  container: {
    margin: Theme.spacing.large,
    padding: Theme.spacing.large,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.medium,
    ...Theme.shadows.medium,
  },
  pageContainer: {
    margin: Theme.spacing.large,
    padding: Theme.spacing.large,
    backgroundColor: Theme.colors.lightGray,
    borderRadius: Theme.borderRadius.medium,
    ...Theme.shadows.small,
  },

  // Text Styles
  title: {
    fontSize: Theme.fontSizes.extraLarge,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Theme.fontSizes.large,
    fontWeight: 'bold',
    color: Theme.colors.black,
    marginVertical: Theme.spacing.small,
  },
  text: {
    fontSize: Theme.fontSizes.medium,
    color: Theme.colors.gray,
    marginVertical: Theme.spacing.small,
  },
  link: {
    fontSize: Theme.fontSizes.medium,
    fontWeight: 'bold',
    color: Theme.colors.primaryDark,
    textDecorationLine: 'underline',
  },

  // Buttons
  button: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.medium,
    borderRadius: Theme.borderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: Theme.fontSizes.medium,
    fontWeight: 'bold',
    color: Theme.colors.white,
  },
  buttonSecondary: {
    backgroundColor: Theme.colors.secondary,
    padding: Theme.spacing.medium,
    borderRadius: Theme.borderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.small,
    padding: Theme.spacing.small,
    marginVertical: Theme.spacing.small,
    fontSize: Theme.fontSizes.medium,
    backgroundColor: Theme.colors.lightGray,
    color: Theme.colors.black,
  },
  inputFocused: {
    borderColor: Theme.colors.primary,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // Error/Success Messages
  errorMessage: {
    backgroundColor: '#ffecec',
    borderWidth: 1,
    borderColor: '#f5c2c2',
    color: Theme.colors.error,
    padding: Theme.spacing.medium,
    borderRadius: Theme.borderRadius.small,
    textAlign: 'center',
  },
  successMessage: {
    backgroundColor: '#e6ffed',
    borderWidth: 1,
    borderColor: '#c3f7d5',
    color: Theme.colors.success,
    padding: Theme.spacing.medium,
    borderRadius: Theme.borderRadius.small,
    textAlign: 'center',
  },

  // Shadows
  shadowSmall: Theme.shadows.small,
  shadowMedium: Theme.shadows.medium,
});

export default GlobalStyles;
