import { StyleSheet } from "react-native";

import { AppTheme } from "@/constants/app-theme";

const CertidoesWebStyles = StyleSheet.create({
  contentMinimal: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: "center",
  },
  title: {
    fontFamily: AppTheme.typography.fontBold,
    fontSize: 22,
    textAlign: "center",
    color: "#1F2024",
    marginBottom: 16,
  },
  container: {
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
  },
  row: {
    width: "100%",
    marginBottom: 24,
  },
  checkboxLabel: {
    textAlign: "justify",
    fontFamily: AppTheme.typography.fontRegular,
    fontSize: 15,
    lineHeight: 22,
    color: "#1F2024",
  },
  helperText: {
    marginTop: 12,
    fontFamily: AppTheme.typography.fontRegular,
    fontSize: 14,
    lineHeight: 21,
    color: "#6F7480",
  },
  optionButtonsContainer: {
    width: "100%",
    marginTop: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTextTitle: {
    fontFamily: AppTheme.typography.fontBold,
    fontSize: 15,
    color: "#1F2024",
  },
  buttonContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  laterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  laterIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  laterButtonText: {
    color: "#730D83",
    fontSize: 15,
    fontFamily: AppTheme.typography.fontBold,
  },
  // modal 

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    zIndex: 1000,
  },

  modalContainer: {
    width: 600,
    maxWidth: '90%',
    backgroundColor: '#730d83',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },

  modalTitle: {
     fontFamily: AppTheme.typography.fontBold,
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    width: '100%',
    gap: 20,
  },

  categoryButton: {
    width: 120,
    height: 120,
    backgroundColor: '#FFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  categoryIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  categoryText: {
     fontFamily: AppTheme.typography.fontBold,
    marginTop: 10,
    fontSize: 14,
    color: '#730d83',
    fontWeight: 'bold',
    textAlign: 'center',
  },

});

export default CertidoesWebStyles;
